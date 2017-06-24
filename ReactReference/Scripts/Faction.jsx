var FactionListItem = React.createClass({
    getInitialState: function () {
        return {
            isSelected: false,
            hover_flag: false
        };
    },
    hoverEvent: function () {
        this.setState({ hover_flag: !this.state.hover_flag });
    },
    clickHandler: function () {
        var currentValue = this.state.isSelected || false;
        if (!currentValue) {
            this.setState({ isSelected: true });
        } else {
            this.setState({ isSelected: false });
        }
    },
    handleDeleteClick: function(e) {
        e.preventDefault();
        this.props.onDeleteSubmit({ FactionId: this.props.factionId });
    },
    render: function () {
        var divStyle = {
            background: '#008888',
            padding: '10px'
        };
        if (this.state.isSelected  || this.state.hover_flag) {
            divStyle['background'] = "#008800";
        }
        return (
                <div 
                     className="factionBox" 
                     style={divStyle} 
                     onClick={this.clickHandler} 
                     onMouseEnter={this.hoverEvent}
                     onMouseLeave={this.hoverEvent}>
                    <h2>{this.props.name}</h2>
                    <p>{this.props.children}</p>
                    <input type="submit" value="Delete" onClick={this.handleDeleteClick} />
                </div>
            );
    }
});

FactionListItem.propTypes = {
    onDeleteSubmit: React.PropTypes.object.isRequired
}

var FactionList = React.createClass({
    render: function() {
        var factionNodes = this.props.data.map(function (faction) {
            return (
                    <FactionListItem factionId={faction.FactionId}
                                     onDeleteSubmit={faction.handleDeleteFactionFromList}
                                     key={faction.FactionId}
                                     name={faction.Name}
                                     
                                     >
                        {faction.Description}
                    </FactionListItem>
                );
            });
        return (
        <div className="commentList">
            {factionNodes}
        </div>
        );
    }
});

var FactionForm = React.createClass({
    getInitialState: function () {
        return { name: '', description: '' };
    },
    handleNameChange: function (e) {
        this.setState({ name: e.target.value });
    },
    handleDescriptionChange: function (e) {
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
    render: function () {
        return (
            <form className="factionForm" onSubmit={this.handleSubmit}>
                <input type="text" placeholder="Faction Name" value={this.state.Name} onChange={this.handleNameChange}/>
                <input type="submit" value="Add" />
                <br />
                <textarea placeholder="Faction Description..." value={this.state.Description} onChange={this.handleDescriptionChange}/>
            </form>
        );
    }
});

var FactionBox = React.createClass({
    loadViewPointsFromServer: function () {
        var xhr = new XMLHttpRequest();
        xhr.open('get', this.props.url, true);
        xhr.onload = function () {
            var data = JSON.parse(xhr.responseText);
            for (var i = 0; i < data.length; i++)
            {
                data[i].handleDeleteFactionFromList = this.handleDeleteFactionFromList;
            }
            this.setState({ data: data });
        }.bind(this);
        xhr.send();
    },
    handleFactionSubmit: function (faction) {
        var data = new FormData();
        data.append('Description', faction.Description);
        data.append('Name', faction.Name);

        var xhr = new XMLHttpRequest();
        xhr.open('post', this.props.submitUrl, true);
        xhr.onload = function () {
            this.loadViewPointsFromServer();
        }.bind(this);
        xhr.send(data);
    },
    handleDeleteFactionFromList: function (faction) {
        if (confirm("Really delete this Faction?")) {
            var data = new FormData();
            data.append('FactionId', faction.FactionId);

            var xhr = new XMLHttpRequest();
            xhr.open('post', this.props.deleteUrl, true);
            xhr.onload = function () {
                this.loadViewPointsFromServer();
            }.bind(this);
            xhr.send(data);
        }
    },

    getInitialState: function () {
        return { data: [0] };
    },
    componentWillMount: function () {
        this.loadViewPointsFromServer();
        window.setInterval(this.loadViewPointsFromServer, this.props.pollInterval);
    },

    render: function () {
        return (
            <div className="factionList">
                <FactionList data={this.state.data} onDeleteFactionFromList={this.handleDeleteFactionFromList} />
                <FactionForm onFactionSubmit={this.handleFactionSubmit} />
            </div>
            );
        
    }
});

ReactDOM.render(
    <FactionBox url="factions" submitUrl="factions/new" deleteUrl="factions/delete" pollInterval={20000} />,
    document.getElementById('factionContent')
);