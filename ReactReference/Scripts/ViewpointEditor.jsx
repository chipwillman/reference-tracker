var ViewpointEvidenceListItem = React.createClass({
    render: function() {
        return (
            <div>
                <h4>{this.props.name}</h4>
                {this.props.statement}
            </div>
        );
    }
});

var ViewpointEvidenceForm = React.createClass({
    getInitialState: function() {
        return { name: '', statement: '', status: 'new', importance: '1', editReferenceFields: true, type: '10' };
    },
    references: function() {
        var newReference = { ReferenceId: "", Name: "Create New Reference", type: "10", cite:"", confidence: 0.5 };
        var result = [];
        result.push(newReference);
        return result.concat(EditorEvents.references);
    },
    saveEvidenceWithNewReference: function() {
        var data = new FormData();
        data.append('Name', this.state.name);
        data.append('Cite', this.state.cite);
        data.append('Type', this.state.type);
        data.append('Confidence', this.state.confidence);
        data.append('ViewpointId', this.props.viewpointId);

        var xhr = new XMLHttpRequest();
        xhr.open('post', this.props.submitReferenceUrl, true);
        xhr.onload = function(e) {
            if (e.currentTarget.response) {
                this.setState({ referenceId: e.currentTarget.response.replace("\"", "").replace("\"", "") });
                this.saveEvidence();
            }
        }.bind(this);
        xhr.send(data);

    },
    saveEvidence: function() {
        var data = new FormData();
        data.append('Name', this.state.name);
        data.append('Status', this.state.status);
        data.append('ViewpointId', this.props.viewpointId);
        data.append('FactionId', this.state.factionId);
        data.append('ReferenceId', this.state.referenceId);
        data.append('Importance', this.state.importance);
        data.append('Statement', this.state.statement);

        var xhr = new XMLHttpRequest();
        xhr.open('post', this.props.submitEvidenceUrl, true);
        xhr.onload = function (e) {
            if (e.currentTarget.response) {
                this.setState({ referenceId: '', statement: '' });
                this.setReferenceFields();
                this.props.onEvidenceChanged();
            }
        }.bind(this);
        xhr.send(data);
    },
    handleSubmit: function(e) {
        e.preventDefault();
        var name = this.state.name.trim();
        var cite = this.state.cite.trim();
        var referenceId = this.state.referenceId;
        var statement = this.state.statement;
        var status = this.state.name.trim();
        var factionId = this.state.factionId;
        var importance = this.state.importance;
        if (!statement || !cite || !name)
            return;
        if (referenceId === "" || referenceId == undefined) {
            this.saveEvidenceWithNewReference();
        } else {
            this.saveEvidence();
        }
    },
    handleStatementChanged: function(e) {
        this.setState({ statement: e.target.value });
    },
    setReferenceFields: function(referenceId) {
        var reference = EditorEvents.findReference(referenceId);
        if (reference) {
            this.setState({
                editReferenceFields: false,
                name: reference.Name,
                cite: reference.Cite,
                type: reference.Type,
                referenceId: reference.ReferenceId,
                confidence: reference.Confidence
            });
        } else {
            this.setState({ editReferenceFields: true, name: "", cite: "", type: "10", confidence: 0.5 });
        }

    },
    handleReferenceNameChanged: function(e) {
        this.setState({ name: e.target.value });
    },
    handleReferenceSiteChanged: function(e) {
        this.setState({ cite: e.target.value });
    },
    handleReferenceTypeChanged: function(e) {
        this.setState({ type: this.refs.referenceTypeSelector.value });
    },
    handleReferenceConfidenceChanged: function(e) {
        this.setState({ confidence: e.target.value });
    },
    handleReferenceChanged: function(e) {
        if (e.target.value !== "") {
            this.setState({ referenceId: e.target.value });
        } else {
            this.setState({ referenceId: "" });
        }
        this.setReferenceFields(e.target.value);
    },
    handleFactionChanged: function(e) {
        this.setState({ factionId: e.target.value });
    },
    componentWillMount: function(e) {
        this.setState({ factionId: EditorEvents.factions[0].FactionId });
    },
    render: function () {
        var textareaStyle = {
            width: "100%",
            height: "200px"
        };
        var textboxStyle = {
            width: "100%"
        };
        var referenceOptions = this.references().map(function(reference) {
            return <option key={`option_${reference.ReferenceId}`} value={reference.ReferenceId}>{reference.Name}</option>;
        });
        var factions = EditorEvents.factions.map(function(faction) {
            return <option key={`evidencefaction_${faction.FactionId}`} value={faction.FactionId }>{faction.Name}</option>;
        });
        var opts = {};
        if (this.state.editReferenceFields) {
            opts['readOnly'] = 'readOnly';
        }
        var referenceType = "Publicly Sourced/Debated";
        switch (this.state.type) {
        case "100":
            referenceType = "PR Scientific Article";
            break;
        case "90":
            referenceType = "Scientific Journal";
            break;
        case "80":
            referenceType = "Live Video Evidence";
            break;
        case "60":
            referenceType = "Well Sourced Article";
            break;
        case "40":
            referenceType = "ReligousText";
            break;
        case "20":
            referenceType = "Anonymous Source Journalism";
            break;
        }

        var referenceDetails = (
            <div>
                Type: {referenceType}
                <br />
                Name: {this.state.name}
                <br/>
                Cite: {this.state.cite}
                <br/>
                Confidence: {this.state.confidence}
            </div>
        );
        if (this.state.editReferenceFields) {
            referenceDetails = (
                <div>
                    <select onChange={this.handleReferenceTypeChanged} value={this.state.type} ref="referenceTypeSelector">
                        <option value="100">PR Scientific Article</option>
                        <option value="90">Scientific Journal</option>
                        <option value="80">Live Video Evidence</option>
                        <option value="60">Well Sourced Article</option>
                        <option value="40">ReligousText</option>
                        <option value="20">Anonymous Source Journalism</option>
                        <option value="10">Publicly Sourced/Debated</option>
                    </select>
                    <br />
                    <input style={textboxStyle} type="text" value={this.state.name} placeholder="Reference Name" onChange={this.handleReferenceNameChanged}/>
                    <br/>
                    <input style={textboxStyle} type="text" value={this.state.cite} placeholder="Cite as" onChange={this.handleReferenceSiteChanged}/>
                    <br/>
                    <input style={textboxStyle} type="text" value={this.state.confidence} placeholder="Confidence Level" onChange={this.handleReferenceConfidenceChanged}/>
                </div>
            );
        }
        return (
            <form className="ViewpointEvidenceForm" onSubmit={this.handleSubmit}>
                Add Evidence
                <h4>Reference</h4>
                <select onChange={this.handleReferenceChanged}>
                    {referenceOptions}
                </select>
                {referenceDetails}
                <h4>Statement</h4>
                <select onChange={this.handleFactionChanged}>
                    {factions}
                </select>
                <textarea style={textareaStyle} placeholder="Statement" value={this.state.statement} onChange={this.handleStatementChanged} />
                <br/>
                <input type="submit" value="Add"/>
            </form>
        );
    }
});

var ViewpointEvidenceEditor = React.createClass({
    render: function () {
        var self = this;
        var viewpointReferenceNodes = this.props.editorViewpoint.Evidence.map(function (viewpointEvidence) {
            if (self.props.viewpointId !== null)
            {
                return (
                    <ViewpointEvidenceListItem viewpointId={self.props.viewpointId}
                                               onDeleteSubmit={self.props.onHandleDeleteViewpointFromList}
                                               key={viewpointEvidence.viewpointEvidenceId}
                                               name={viewpointEvidence.Name} 
                                               status={viewpointEvidence.Status}
                                               description={viewpointEvidence.description}
                                               statement={viewpointEvidence.statement}
                                               />
                );
            }
            return (
                <div>No ViewpointId</div>
            );
        });
        var viewpointEvidenceForm = null;
        //references={this.props.references}
        if (EditorEvents.isLoggedIn) {
            viewpointEvidenceForm = (
                <ViewpointEvidenceForm onEvidenceChanged={this.props.onEvidenceChanged}
                                       viewpointId={this.props.viewpointId} 
                                       evidence={this.props.evidence} 
                                       submitReferenceUrl={this.props.submitReferenceUrl}
                                       submitEvidenceUrl={this.props.submitEvidenceUrl}>
                                       </ViewpointEvidenceForm>
                );
        }
        return (
            <div>
                <p>References</p>
                {viewpointReferenceNodes}
                {viewpointEvidenceForm}
            </div>
            );
    }
});

var ViewpointEditor = React.createClass({
    getInitialState: function() {
        return { show: false, viewpointId: '', editDetails: false, editorViewpoint: { Name: 'Loading', Evidence: [], References: [] } };
    },
    CancelEdit(e) {
        this.setState({ show: false, editDetails: false });
    },
    SaveViewPoint(e) {
        this.setState({ editDetails: false });
        //TODO Save Viewpoint Changes
    },
    EditButtonClick(e) {
        this.setState({ editDetails: true });
    },
    LoadViewpoint(viewpointId) {
        var xhr = new XMLHttpRequest();
        var address = this.props.viewPointUrl + "/" + viewpointId;
        xhr.open('get', address, true);
        xhr.onload = function() {
            var viewpoint = JSON.parse(xhr.responseText);
            this.setState({ editorViewpoint: viewpoint });
        }.bind(this);
        xhr.send();
    },
    EditViewPoint(viewpointId) {
        this.setState({ viewpointId: viewpointId });
        this.LoadViewpoint(viewpointId);
        this.setState({ show: true });
    },
    HandleEvidenceChanged() {
        this.LoadViewpoint(this.state.viewpointId);
    },
    componentWillMount: function() {
        EditorEvents.editViewPoint = this.EditViewPoint;
    },
    render() {
// Render nothing if the "show" prop is false
        if (!this.state.show) {
            return null;
        }

// The gray background
        var backdropStyle = {
            position: 'fixed',
            top: 0,
            bottom: 0,
            left: 0,
            right: 0,
            backgroundColor: 'rgba(0,0,0,0.3)',
            padding: 50
        };

// The modal "window"
        var modalStyle = {
            backgroundColor: '#fff',
            borderRadius: 5,
            minWidth: 380,
            maxWidth: 1200,
            minHeight: 300,
            margin: '0 auto',
            display: 'block',
            padding: 30,
            left: 0,
            bottom: 20,
            top: 20
        };
        var referencesPanel = (
            <div>
                <ViewpointEvidenceEditor onEvidenceChanged={this.HandleEvidenceChanged}
                                         viewpointId={this.state.viewpointId} 
                                        editorViewpoint = { this.state.editorViewpoint } 
                                        submitReferenceUrl={this.props.submitReferenceUrl}
                                        submitEvidenceUrl={this.props.submitEvidenceUrl}
                                         />
            </div>
            );
        var contentPanel = (
            <div>
                <h2>{this.state.editorViewpoint.Name}</h2>
                    <div>Begin Date: {this.state.editorViewpoint.BeginDate} End Date: {this.state.editorViewpoint.EndDate}</div>
                <p>{this.state.editorViewpoint.Description}</p>
            </div>
            );
        if (this.state.editDetails) {
            contentPanel = (
                <div>
                    <h2><input type="text" value={this.state.editorViewpoint.Name}/></h2>
                    <div>Begin Date: <input type="text" value = {this.state.editorViewpoint.BeginDate} />
                         End Date: <input type="text" value = {this.state.editorViewpoint.EndDate} /></div>
                    <p><textarea id="viewPointDescription">{this.state.editorViewpoint.Description}</textarea></p>
                </div>
                );
        }
        var editViewpointControls = (
            <button onClick={this.CancelEdit}>
                Close
            </button>
        );
        if (EditorEvents.isLoggedIn) {
            editViewpointControls = (
                <div>
                    <button onClick={this.EditButtonClick}>
                        Edit
                    </button>
                    <button onClick={this.CancelEdit}>
                        Cancel
                    </button>
                    <button onClick={this.SaveViewPoint}>
                        Save
                    </button>
                </div>
            );
        } 
        return (
            <div>
            <div className="backdrop" style={backdropStyle}>
            </div>
            <div className="modal" style={modalStyle}>
                {contentPanel}
                <div className="footer">
                    {editViewpointControls}
                </div>
                {referencesPanel}
            </div>
            </div>
        );
    }
});

ReactDOM.render(
    <ViewpointEditor 
                     viewPointUrl="viewpoints" 
                     submitViewpointUrl="viewpoint/save" 
                     submitReferenceUrl="references/new" 
                     submitEvidenceUrl="evidence/new" 
                     deleteUrl="viewpoint/delete" />,
    document.getElementById('viewpoitnEditorContent')
);
