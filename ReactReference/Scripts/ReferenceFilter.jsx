var ReferenceListItemView = React.createClass({
    render: function () {
        return (
            <div>
                <b>{this.props.name}</b>
                <br />
                {this.props.cite}
            </div>
        );
    }
});

var ReferenceListItemEdit = React.createClass({
    handleNameChanged : function(e) {
        this.props.onReferenceItemNameChanged(e);
    },
    handleCiteChanged: function(e) {
        this.props.onReferenceItemCiteChanged(e);
    },
    render: function () {
        return (
            <div>
                <input type="text" defaultValue={this.props.name} onChange={this.handleNameChanged} />
                <br />
                <textarea defaultValue={this.props.cite} onChange={this.handleCiteChanged} />
            </div>
        );
    }
});

var ReferenceListItem = React.createClass({
    getInitialState: function () {
        return { editDetails: false };
    },
    onDeleteClick: function () {
        this.props.onDeleteSubmit(this.props.ReferenceId);
    },
    onEditClick: function () {
        this.setState({ editDetails: true });
    },
    onSaveClick: function () {
        var id = this.state.referenceItemId;
        var name = this.state.referenceItemName;
        var cite = this.state.referenceItemCite;
        if (name && cite && id) {
            
        }
        this.setState({ editDetails: false });
    },
    handleReferenceItemCiteChanged: function (e) {
        this.setState({ referenceItemName: e.target.value });
    },
    handleReferenceItemNmeChanged: function (e) {
        this.setState({ referenceItemCite: e.target.value });
    },
    render: function () {
        var actionButtons = (
                   <div></div>
        );
        var itemDetails = (
            <ReferenceListItemView
                name={this.props.name}
                cite={this.props.cite}
            />
            );
        if (this.state.editDetails) {
            itemDetails = (
                <ReferenceListItemEdit
                    id={this.props.id}
                    name={this.props.name}
                    onReferenceItemNameChanged={this.handleReferenceItemNameChanged}
                    cite={this.props.cite}
                    onReferenceItemCiteChanged={this.handleReferenceItemCiteChanged}
                />
            );
        }
        if (EditorEvents.isLoggedIn) {
            if (this.state.editDetails) {
                actionButtons = (
                    <div>
                        <input type="submit" onClick={this.onSaveClick} value="Save"/>
                        <input type="submit" onClick={this.onDeleteClick} value="Delete"/>
                    </div>
                );
            } else {
                actionButtons = (
                    <div>
                        <input type="submit" onClick={this.onEditClick} value="Edit"/>
                    </div>
                );
            }
        }
        return (
            <div >
                {itemDetails}
                {actionButtons}
            </div>
            );
    }
});

var ReferenceList = React.createClass({
    render: function () {
        var self = this;
        var referenceNodes = this.props.referenceData.map(function (reference) {
            if (reference.ReferenceId !== "")
            {
                return (
                    <ReferenceListItem ReferenceId={reference.ReferenceId}
                                       onDeleteSubmit={self.props.onHandleDeleteReferenceFromList}
                                       onSaveSubmit={self.props.onHandleSaveReferenceFromList}
                                       key={reference.ReferenceId}
                                       id={reference.ReferenceId}
                                       name={reference.Name} 
                                       cite={reference.Cite}>
                    </ReferenceListItem>
                );
            }
            return (
                <div>No results</div>
            );
        });
        return(
            <div>
                {referenceNodes}
            </div>
        );
    }
});

var ReferenceBox = React.createClass({
    loadReferencesFromServer: function () {
        if (this.props.referenceUrl) {
            var xhr = new XMLHttpRequest();
            xhr.open('get', this.props.referenceUrl, true);
            xhr.onload = function() {
                var data = JSON.parse(xhr.responseText);
                this.setState({ referenceData: data });
                EditorEvents.references = data;
            }.bind(this);
            xhr.send();
        }
    },
    handleSaveReferenceFromList: function (reference) {
        if (this.props.saveUrl) {
            var data = new FormData();
            data.append('ReferenceId', reference.ReferenceId);
            data.append('Name', reference.Name);
            data.append('Cite', reference.Cite);
            var xhr = new XMLHttpRequest();
            xhr.open('post', this.props.submitUrl, true);
            xhr.onload = function () {
                this.loadReferencesFromServer();
            }.bind(this);
            xhr.send(data);
        }
    },
    handleDeleteReferenceFromList: function (reference) {
        if (confirm("Really delete this reference?")) {
            var data = new FormData();
            data.append('ReferenceId', reference.ReferenceId);
            if (this.props.deleteUrl) {
                var xhr = new XMLHttpRequest();
                xhr.open('post', this.props.deleteUrl, true);
                xhr.onload = function() {
                    this.loadReferencesFromServer();
                }.bind(this);
                xhr.send(data);
            }
        }
    },
    onFilterClick: function() {
        this.loadReferencesFromServer();
    },
    handleFilterChange: function(e) {
        this.setState({ filter: e.target.value });
    },
    getInitialState: function () {
        return { referenceData: [] };
    },
    componentWillMount: function() {
        this.loadReferencesFromServer();
        window.setInterval(this.loadReferencesFromServer, this.props.pollInterval);
    },
    render: function() {
        return (
            <div className="ReferenceList">
                <input style={this.textboxStyle} type="text" placeholder="Filter References" onChange={this.handleFilterChange} />
                <input type="submit" onClick={this.onFilterClick} value="Filter" />
                <br />
                <ReferenceList referenceData={this.state.referenceData} onHandleDeleteReferenceFromList={this.handleDeleteReferenceFromList} onHandleSaveReferenceFromList={this.handleSaveReferenceFromList}/>
            </div>
        );
    }
});
