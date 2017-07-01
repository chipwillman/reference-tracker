var ReferenceListItem = React.createClass({
    onDeleteClick: function () {
        this.props.onDeleteSubmit(this.props.ReferenceId);
    },
    onViewClick: function () {

    },
    render: function () {
        var actionButtons = (
                   <div></div>
            );
        if (EditorEvents.isLoggedIn) {
            actionButtons = (
                <div>
                    <input type="submit" onClick={this.onViewClick} value="View" />
                    <input type="submit" onClick={this.onDeleteClick} value="delete"/>
                </div>
            );
        }
        return (
            <div>
                <b>{this.props.name}</b>
                {this.props.cite}
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
                                        key={reference.ReferenceId}
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
    loadReferencesFromServer: function() {
        var xhr = new XMLHttpRequest();
        xhr.open('get', this.props.referenceUrl, true);
        xhr.onload = function() {
            var data = JSON.parse(xhr.responseText);
            this.setState({ referenceData: data });
            EditorEvents.references = data;
        }.bind(this);
        xhr.send();
    },
    handleDeleteReferenceFromList: function (reference) {
        if (confirm("Really delete this reference?")) {
            var data = new FormData();
            data.append('ReferenceId', reference.ReferenceId);

            var xhr = new XMLHttpRequest();
            xhr.open('post', this.props.deleteUrl, true);
            xhr.onload = function () {
                this.loadHypothesissFromServer();
            }.bind(this);
            xhr.send(data);
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
                <ReferenceList referenceData={this.state.referenceData} onHandleDeleteReferenceFromList={this.handleDeleteReferenceFromList}/>
            </div>
        );
    }
});

ReactDOM.render(
    <ReferenceBox referenceUrl="references" referenceSubmitUrl="references/new" deleteUrl="references/delete" pollInterval={60000} />,
    document.getElementById('referencesFilterContent')
);