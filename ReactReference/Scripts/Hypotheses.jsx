var HypothesisListItem = React.createClass({
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
    handleEditClick: function(e) {
        EditorEvents.editHypothesis(this.props.HypothesisId);
    },
    handleDeleteClick: function(e) {
        e.preventDefault();
        this.props.onDeleteSubmit({ HypothesisId: this.props.HypothesisId });
    },
    render: function () {
        var divStyle = {
            background: '#008888',
            padding: '10px',
            margin: '10px'
        };
        var controlBar = (
            <input type="submit" value="View" onClick={this.handleEditClick} />
        );
        if (EditorEvents.isLoggedIn) {
            controlBar = (
                <div>
                    <input type="submit" value="Delete" onClick={this.handleDeleteClick}/>
                    <input type="submit" value="Edit" onClick={this.handleEditClick}/>
                </div>
            );
        }
        if (this.state.isSelected  || this.state.hover_flag) {
            divStyle['background'] = "#008800";
        }
        return (
            <div
                className="HypothesisBox"
                style={divStyle}
                onClick={this.clickHandler}
                onMouseEnter={this.hoverEvent}
                onMouseLeave={this.hoverEvent}>
                <h3>{this.props.name}</h3>
                <p>{this.props.children}</p>
                {controlBar}
            </div>
        );
    }
});

var HypothesisList = React.createClass({
    render: function () {
        var self = this;
        var HypothesisNodes = this.props.data.map(function (Hypothesis) {
            if (Hypothesis.HypothesisId !== '')
            {
                return (
                    <HypothesisListItem HypothesisId={Hypothesis.HypothesisId}
                                       onDeleteSubmit={self.props.onHandleDeleteHypothesisFromList}
                                       key={Hypothesis.HypothesisId}
                                       name={Hypothesis.Name} >
                        {Hypothesis.Description}
                    </HypothesisListItem>
                );
            }
            return (
                <div>No results</div>
            );
        });
        return (
            <div className="HypothesisList">
                {HypothesisNodes}
            </div>
        );
    }
});

var HypothesisForm = React.createClass({
    getInitialState: function () {
        return { name: '', description: '', beginDate: '' };
    },
    handleNameChange: function (e) {
        this.setState({ name: e.target.value });
    },
    handleDescriptionChange: function (e) {
        this.setState({ description: e.target.value });
    },
    factionChanged: function (e) {
        this.setState({ faction: this.refs.factionSelector.value });
    },
    handleSubmit: function (e) {
        e.preventDefault();
        var name = this.state.name.trim();
        var description = this.state.description.trim();
        var faction = this.state.faction.trim();
        if (!name || !description || !faction) {
            return;
        }
        this.props.onHypothesisSubmit({ Description: description, Name: name, FactionId: faction });
        this.setState({ name: '', description: '', faction: '' });
    },
    render: function () {
        var textboxStyle = {
            width: "347px"
        }
        var textareaStyle = {
            width: "347px",
            height: "90px"
        };

        var factionOptions = EditorEvents.factions.map(function (faction) {
            return <option key={`option_${faction.FactionId}`} value={faction.FactionId}>{faction.Name}</option>;
        });
        return (
            <form className="HypothesisForm" onSubmit={this.handleSubmit}>
                <input style={textboxStyle} type="text" placeholder="Hypothesis Name" value={this.state.name} onChange={this.handleNameChange} />
                <select ref="factionSelector" onChange={this.factionChanged }>
                    {factionOptions}
                </select>
                <textarea style={textareaStyle} placeholder="Hypothesis Description..." value={this.state.description} onChange={this.handleDescriptionChange}/>
                <br />
                <input type="submit" value="Add" />
            </form>
        );
    }
});

var HypothesisBox = React.createClass({
    loadHypothesissFromServer: function () {
        if (this.props.hypothesisUrl) {
            var xhr = new XMLHttpRequest();
            xhr.open('get', this.props.hypothesisUrl, true);
            xhr.onload = function() {
                var data = JSON.parse(xhr.responseText);
                EditorEvents.hypothesis = data;
                this.setState({ data: data });
                EditorEvents.viewpointsChanged();
            }.bind(this);
            xhr.send();
        }
    },
    handleHypothesisSubmit: function (hypothesis) {
        var data = new FormData();
        data.append('Description', hypothesis.Description);
        data.append('Name', hypothesis.Name);
        data.append('FactionId', hypothesis.FactionId);

        if (this.props.hypothesisSubmitUrl) {
            var xhr = new XMLHttpRequest();
            xhr.open('post', this.props.hypothesisSubmitUrl, true);
            xhr.onload = function() {
                this.loadHypothesissFromServer();
            }.bind(this);
            xhr.send(data);
        }
    },
    handleDeleteHypothesisFromList: function (hypothesis) {
        if (confirm("Really delete this hypothesis?")) {
            var data = new FormData();
            data.append('HypothesisId', hypothesis.HypothesisId);
            if (this.props.deleteUrl) {
                var xhr = new XMLHttpRequest();
                xhr.open('post', this.props.deleteUrl, true);
                xhr.onload = function() {
                    this.loadHypothesissFromServer();
                }.bind(this);
                xhr.send(data);
            }
        }
    },

    getInitialState: function () {
        return { data: [] };
    },
    componentWillMount: function () {
        this.loadHypothesissFromServer();
        if (this.props.pollInterval) {
            window.setInterval(this.loadHypothesissFromServer, this.props.pollInterval);
        }
    },
    render: function () {
        var addHypothesisForm = (
            <p>Log in to add a hypothesis</p>
        );
        if (EditorEvents.isLoggedIn) {
            addHypothesisForm = (
                <HypothesisForm onHypothesisSubmit={this.handleHypothesisSubmit} />
            );
        } 

        return (
            <div className="HypothesisList">
                <HypothesisList data={this.state.data} onHandleDeleteHypothesisFromList={this.handleDeleteHypothesisFromList} />
                {addHypothesisForm}
            </div>
        );
        
    }
});


