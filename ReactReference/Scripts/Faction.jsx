var FactionListItem = React.createClass({
    getInitialState: function() {
        return {
            isSelected: false,
            hover_flag: false
        };
    },
    hoverEvent: function() {
        this.setState({ hover_flag: !this.state.hover_flag });
    },
    clickHandler: function() {
        var currentValue = this.state.isSelected || false;
        if (!currentValue) {
            this.setState({ isSelected: true });
        } else {
            this.setState({ isSelected: false });
        }
    },
    handleDeleteClick: function(e) {
        e.preventDefault();
        this.props.onDeleteSubit({ FactionId: this.props.factionId });
    },
    render: function() {
        var deleteFactionItem = (
            null
        );
        if (EditorEvents.isLoggedIn) {
            deleteFactionItem = (
                <input type="submit" value="Delete" onClick={this.handleDeleteClick}/>
            );
        }

        var divStyle = {
            background: '#008888',
            padding: '10px',
            margin: '10px'
        };
        if (this.state.isSelected || this.state.hover_flag) {
            divStyle['background'] = "#008800";
        }
        return (
            <div
                className="factionBox"
                style={divStyle}
                onClick={this.clickHandler}
                onMouseEnter={this.hoverEvent}
                onMouseLeave={this.hoverEvent}>
                <h3>{this.props.name}</h3>
                <p>{this.props.children}</p>
                {deleteFactionItem}
            </div>
        );
    }
});

var FactionList = React.createClass({
    render: function() {
        var self = this;
        var factionNodes = (
            null
        );
        if (self.props.onDeleteFactionFromList !== null) {
            if (this.props.data && this.props.data[0] !== 0)
                factionNodes = this.props.data.map(function(faction) {
                    return (
                        <FactionListItem factionId={faction.FactionId}
                                         onDeleteSubmit={self.props.onDeleteFactionFromList}
                                         key={faction.FactionId}
                                         name={faction.Name}>
                            {faction.Description}
                        </FactionListItem>
                    );
                });
        } else {
            return (
                <p>onDeleteFactionFromList was null?</p>
            );
        }
        return (
            <div className="FactionList" key="FactionList">
                {factionNodes}
            </div>
        );
    }
});

var FactionForm = React.createClass({
    getInitialState: function() {
        return { name: '', description: '' };
    },
    handleNameChange: function(e) {
        this.setState({ name: e.target.value });
    },
    handleDescriptionChange: function(e) {
        this.setState({ description: e.target.value });
    },
    handleSubmit: function(e) {
        e.preventDefault();
        var name = this.state.name.trim();
        var description = this.state.description.trim();
        if (!name || !description) {
            return;
        }
        this.props.onFactionSubmit({ Description: description, Name: name });
        this.setState({ name: '', description: '' });
    },
    render: function() {
        return (
            <form className="factionForm" onSubmit={this.handleSubmit}>
                <input type="text" placeholder="Faction Name" value={this.state.Name} onChange={this.handleNameChange
}/>
                <textarea placeholder="Faction Description..." value={this.state.Description} onChange={this
                    .handleDescriptionChange}/>
                <br/>
                <input type="submit" value="Add"/>
            </form>
        );
    }
});

var FactionBox = React.createClass({
    loadFactionsFromServer: function() {
        var xhr = new XMLHttpRequest();
        if (this.props.url) {
            xhr.open('get', this.props.url, true);
            xhr.onload = function() {
                var data = JSON.parse(xhr.responseText);
                this.setState({ data: data });
                EditorEvents.factions = data;
            }.bind(this);
            xhr.send();
        }
    },
    handleFactionSubmit: function(faction) {
        var data = new FormData();
        data.append('Description', faction.Description);
        data.append('Name', faction.Name);

        var xhr = new XMLHttpRequest();
        if (this.props.submitUrl) {
            xhr.open('post', this.props.submitUrl, true);
            xhr.onload = function() {
                this.loadFactionsFromServer();
            }.bind(this);
            xhr.send(data);
        }
    },
    handleDeleteFactionFromList: function(faction) {
        if (confirm("Really delete this Faction?")) {
            var data = new FormData();
            data.append('FactionId', faction.FactionId);
            if (this.props.deleteUrl) {
                var xhr = new XMLHttpRequest();
                xhr.open('post', this.props.deleteUrl, true);
                xhr.onload = function() {
                    this.loadFactionsFromServer();
                }.bind(this);
                xhr.send(data);
            }
        }
    },

    getInitialState: function() {
        return { data: [0] };
    },
    componentWillMount: function() {
        this.loadFactionsFromServer();
        if (this.props.pollInterval) {
            window.setInterval(this.loadFactionsFromServer, this.props.pollInterval);
        }
    },

    render: function() {
        var factionForm = (
            <p>Log in to add a faction</p>
        );
        if (EditorEvents.isLoggedIn) {
            factionForm = (
                <FactionForm onFactionSubmit={this.handleFactionSubmit}/>
            );
        }
        return (
            <div className="factionList">
                <FactionList data={this.state.data} onDeleteFactionFromList={this.handleDeleteFactionFromList}/>
                {factionForm}
            </div>
        );

    }
});