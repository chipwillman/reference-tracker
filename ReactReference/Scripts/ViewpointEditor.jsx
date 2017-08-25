var ViewpointEvidenceListItem = React.createClass({
    getInitialState: function () {
        return { editDetails: false, moreDetails: false };
    },
    handleEditClick: function() {
        this.setState({ editDetails: true });
    },
    handleDeleteClick: function () {
        if (confirm("Really delete this evidence?")) {
            this.setState({ editDetails: false });
            var data = new FormData();
            data.append('EvidenceId', this.props.evidenceId);
            if (this.props.submitDeleteEvidenceUrl) {
                var xhr = new XMLHttpRequest();
                xhr.open('post', this.props.submitDeleteEvidenceUrl, true);
                xhr.onload = function () {
                    if (this.props.onEvidenceChanged) {
                        this.props.onEvidenceChanged();
                    }
                }.bind(this);
                xhr.send(data);
            }
        }
    },
    handleSaveClick: function () {
        this.setState({ editDetails: false });
        var data = new FormData();
        var evidenceId = this.props.evidenceId;
        var referenceId = this.state.referenceId || this.props.referenceId;
        var name = this.state.name || this.props.name;
        var status = this.state.status || this.props.status;
        var statement = this.state.statement || this.props.statement;
        var urlLinks = this.state.urlLinks || this.props.urlLinks;

        if (evidenceId && referenceId && status && statement) {
            data.append('EvidenceId', evidenceId);
            data.append('ReferenceId', referenceId);
            data.append('Name', name);
            data.append('Status', status);
            data.append('Statement', statement);
            data.append('UrlLinks', urlLinks);
            if (this.props.submitSaveEvidenceUrl) {
                var xhr = new XMLHttpRequest();
                xhr.open('post', this.props.submitSaveEvidenceUrl, true);
                xhr.onload = function () {
                    if (this.props.onEvidenceChanged) {
                        this.props.onEvidenceChanged();
                    }
                }.bind(this);
                xhr.send(data);
            }


        }
    },
    handleMoreClick: function() {
        this.setState({ moreDetails: true });
    },
    handleLessClick: function () {
        this.setState({ moreDetails: false });
    },
    handleCancelClick: function() {
        this.setState({ editDetails: false });
    },
    handleReferenceChanged: function(e) {
        this.setState({ evidenceId: e.target.value });
    },
    handleNameChanged: function(e) {
        this.setState({ name: e.target.value });
    },
    handleStatementChanged: function (e) {
        this.setState({ statement: e.target.value });
    },
    handleUrlLinksChanged: function (e) {
        this.setState({ urlLinks: e.target.value });
    },
    render: function () {
        var editControls = (
            <div>
                <input type="submit" value="More" onClick={this.handleMoreClick} />
            </div>
        );
        if (this.state.moreDetails) {
            editControls = (
                <div>
                    <input type="submit" value="More" onClick={this.handleMoreClick} />
                    <input type="submit" value="Less" onClick={this.handleLessClick} />
                </div>
                );
        }
        if (EditorEvents.isLoggedIn) {
            if (this.state.moreDetails) {
                editControls = (
                    <div>
                        <input type="submit" value="Edit" onClick={this.handleEditClick}/>
                        <input type="submit" value="Less" onClick={this.handleLessClick} />
                    </div>
                );
            } else {
                editControls = (
                    <div>
                        <input type="submit" value="Edit" onClick={this.handleEditClick} />
                        <input type="submit" value="More" onClick={this.handleMoreClick} />
                    </div>
                    );
            }

        }
        var moreControls = null;
        if (this.state.moreDetails) {
            var referenceType = EditorEvents.getReferenceType(this.props.type);
            moreControls = (
                <div>
                    Type: {referenceType}
                    <br />
                    Name: {this.props.name}
                    <br />
                    Cite: {this.props.cite}
                    <br />
                    Confidence: {this.props.confidence}
                    <br />
                </div>
            );
        }
        var renderedControls = (
                <div>
                    <h4>{this.props.name}</h4>
                    {this.props.statement}
                    <br/>
                    <a target="new" href={this.props.urlLinks}>{this.props.urlLinks}</a>
                    {moreControls}
                    {editControls}
                </div>
            );
        if (this.state.editDetails) {
            var referenceOptions = EditorEvents.references.map(function (reference) {
                return <option key={`evidenceReferenceOption_${reference.ReferenceId}`} value={reference.ReferenceId}>{reference.Name}</option>;
            });
            renderedControls = (
                <div>
                    Source Name
                    <br />
                    <input type="text" defaultValue={this.props.name} onChange={this.handleNameChanged}/>
                    <br />
                    Statement
                    <br />
                    <textarea defaultValue={this.props.statement} onChange={this.handleStatementChanged}/>
                    <br />
                    <p>Urls</p>
                    <input type="text" defaultValue={this.props.urlLinks} onChange={this.handleUrlLinksChanged}/>
                    <br />
                    Reference Details. Edit in reference editor
                    <br />
                    <select defaultValue={this.props.referenceId} onChange={this.handleReferenceChanged} >
                        {referenceOptions}
                    </select>
                    <br />
                    <input type="submit" value="Cancel" onClick={this.handleCancelClick} />
                    <input type="submit" value="Save" onClick={this.handleSaveClick} />
                    <input type="submit" value="Delete" onClick={this.handleDeleteClick} />
                </div>
                );
        }
        return (
        <div className="viewpointEvidence">
            {renderedControls}
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

        if (this.props.submitReferenceUrl) {
            var xhr = new XMLHttpRequest();
            xhr.open('post', this.props.submitReferenceUrl, true);
            xhr.onload = function(e) {
                if (e.currentTarget.response) {
                    this.setState({ referenceId: e.currentTarget.response.replace("\"", "").replace("\"", "") });
                    this.saveEvidence();
                }
            }.bind(this);
            xhr.send(data);
        }
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

        if (this.props.submitEvidenceUrl) {
            var xhr = new XMLHttpRequest();
            xhr.open('post', this.props.submitEvidenceUrl, true);
            xhr.onload = function(e) {
                if (e.currentTarget.response) {
                    this.setState({ referenceId: '', statement: '' });
                    this.setReferenceFields();
                    if (this.props.onEvidenceChanged) {
                        this.props.onEvidenceChanged();
                    }
                }
            }.bind(this);
            xhr.send(data);
        }
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
        if (!statement || !cite || !name ||
            !factionId || !status || importance)
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
    handleUrlLinksChanged: function (e) {
        this.setState({ urlLinks: e.target.value });
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
        var referenceType = EditorEvents.getReferenceType(this.state.type);
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
                                               referenceId={viewpointEvidence.ReferenceId}
                                               key={viewpointEvidence.EvidenceId}
                                               evidenceId={viewpointEvidence.EvidenceId}
                                               name={viewpointEvidence.Name} 
                                               status={viewpointEvidence.Status}
                                               statement={viewpointEvidence.Statement}
                                               cite={viewpointEvidence.Cite}
                                               confidence={viewpointEvidence.Confidence}
                                               type={viewpointEvidence.Type}
                                               urlLinks={viewpointEvidence.UrlLinks}
                                               submitDeleteEvidenceUrl={self.props.submitDeleteEvidenceUrl}
                                               submitSaveEvidenceUrl={self.props.submitSaveEvidenceUrl}
                                               onEvidenceChanged={self.props.onEvidenceChanged}
                                               />
                );
            }
            return (
                <div>No ViewpointId</div>
            );
        });
        var viewpointEvidenceForm = null;
        if (EditorEvents.isLoggedIn) {
            viewpointEvidenceForm = (
                <ViewpointEvidenceForm onEvidenceChanged={this.props.onEvidenceChanged}
                                       viewpointId={this.props.viewpointId} 
                                       submitReferenceUrl={this.props.submitReferenceUrl}
                                       submitEvidenceUrl={this.props.submitEvidenceUrl}>
                                       </ViewpointEvidenceForm>
                );
        }
        return (
            <div>
                <p>Reference Evidence</p>
                <hr />
                {viewpointReferenceNodes}
                <hr />
                {viewpointEvidenceForm}
            </div>
            );
    }
});

var ViewpointEditor = React.createClass({
    getInitialState: function() {
        return { show: false, viewpointId: '', editDetails: false, name: 'Loading', editorViewpoint: { Name: 'Loading', Evidence: [], References: [] } };
    },
    CancelEdit(e) {
        this.setState({ editDetails: false });
    },
    CloseEdit(e) {
        this.setState({ show: false });
    },
    handleBeginDateChange: function (e) {
        this.setState({ beginDate: e.target.value });
    },
    handleDescriptionChange: function (e) {
        this.setState({ description: e.target.value });
    },
    handleEndDateChange: function (e) {
        this.setState({ endDate: e.target.value });
    },
    handleNameChange: function (e) {
        this.setState({ name: e.target.value });
    },
    SaveViewPoint: function() {
        this.setState({ editDetails: false });
        var data = new FormData();
        data.append('ViewPointId', this.state.viewpointId);
        data.append('BeginDate', this.state.beginDate);
        data.append('EndDate', this.state.endDate);
        data.append('Description', this.state.description);
        data.append('Name', this.state.name);
        if (this.props.submitViewpointUrl) {
            var xhr = new XMLHttpRequest();
            xhr.open('post', this.props.submitViewpointUrl, true);
            xhr.onload = function () {
                this.CloseEdit();
            }.bind(this);
            xhr.send(data);
        }
    },
    DeleteViewpoint: function () {
        if (confirm("Really delete this viewpoint?")) {
            this.setState({ editDetails: false });
            var data = new FormData();
            data.append('ViewPointId', this.state.viewpointId);
            if (this.props.submitDeleteViewpointUrl) {
                var xhr = new XMLHttpRequest();
                xhr.open('post', this.props.submitDeleteViewpointUrl, true);
                xhr.onload = function () {
                    this.CloseEdit();
                }.bind(this);
                xhr.send(data);
            }
        }
    },
    EditButtonClick(e) {
        this.setState({ editDetails: true });
    },
    SetViewpoint(viewpoint) {
        this.setState({ editorViewpoint: viewpoint });
        this.setState({ beginDate: viewpoint.BeginDate });
        this.setState({ endDate: viewpoint.EndDate });
        this.setState({ description: viewpoint.Description });
        this.setState({ name: viewpoint.Name });
    },
    LoadViewpoint(viewpointId) {
        if (this.props.viewPointUrl) {
            var xhr = new XMLHttpRequest();
            var address = this.props.viewPointUrl + "/" + viewpointId;
            xhr.open('get', address, true);
            xhr.onload = function() {
                var viewpoint = JSON.parse(xhr.responseText);
                this.SetViewpoint(viewpoint);
            }.bind(this);
            xhr.send();
        }
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
                                         submitDeleteEvidenceUrl={this.props.submitDeleteEvidenceUrl}
                                         submitSaveEvidenceUrl={this.props.submitSaveEvidenceUrl}
                                         />
            </div>
            );
        var contentPanel = (
            <div>
                <h2>{this.state.name}</h2>
                    <div>Begin Date: {this.state.beginDate} End Date: {this.state.endDate}</div>
                <p>{this.state.description}</p>
            </div>
            );
        if (this.state.editDetails) {
            contentPanel = (
                <div>
                    <h2><input type="text" defaultValue={this.state.name} onChange={this.handleNameChange}/></h2>
                    <div>Begin Date: <input type="text" defaultValue={this.state.beginDate} onChange={this.handleBeginDateChange}/>
                        End Date: <input type="text" defaultValue={this.state.endDate} onChange={this.handleEndDateChange}/></div>
                    <p><textarea id="viewPointDescription" onChange={this.handleDescriptionChange} defaultValue={this.state.description}/></p>
                </div>
                );
        }
        var editViewpointControls = (
            <button onClick={this.CloseEdit}>
                Close
            </button>
        );
        if (EditorEvents.isLoggedIn) {
            if (this.state.editDetails) {
                editViewpointControls = (
                    <div>
                        <button onClick={this.CancelEdit}>
                            Cancel
                        </button>
                        <button onClick={this.SaveViewPoint}>
                            Save
                        </button>
                        <button onClick={this.DeleteViewpoint}>
                            Delete
                        </button>
                    </div>
                );
            } else {
                editViewpointControls = (
                    <div>
                        <button onClick={this.EditButtonClick}>
                            Edit
                        </button>
                        <button onClick={this.CloseEdit}>
                            Close
                        </button>
                    </div>
                );
            }
        } 
        return (
            <div>
            <div className="backdrop" style={backdropStyle} onClick={this.CloseEdit}>
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

