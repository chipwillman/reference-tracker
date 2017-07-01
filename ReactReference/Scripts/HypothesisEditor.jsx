var HypothesisEditor = React.createClass({
    getInitialState: function () {
        return { showHypothesisDetails: false, hypothesisId: '', editHypothesisDetails: false, editorHypothesis: {Name: 'Loading'} };
    },
    CancelEdit(e) {
        this.setState({ showHypothesisDetails: false, editHypothesisDetails: false });
    },
    SaveHypothesis(e) {
        this.setState({ editHypothesisDetails: false });
        //TODO Save Hypothesis Changes
        //TODO Save Hypothesis Changes
    },
    EditButtonClick(e) {
        this.setState({ editHypothesisDetails: true });
    },
    LoadHypothesis(hypothesisId) {
        var xhr = new XMLHttpRequest();
        var address = this.props.hypothesesUrl + "/" + hypothesisId;
        xhr.open('get', address, true);
        xhr.onload = function () {
            var hypothesis = JSON.parse(xhr.responseText);
            this.setState({ editorHypothesis: hypothesis });
        }.bind(this);
        xhr.send();
    },
    EditHypothesis(hypothesisId) {
        this.LoadHypothesis(hypothesisId);
        this.setState({ showHypothesisDetails: true });
    },
    componentWillMount: function () {
        EditorEvents.editHypothesis = this.EditHypothesis;
    },
    render()
    {
        // Render nothing if the "showHypothesisDetails" prop is false
        if (!this.state.showHypothesisDetails) {
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
        var contentPanel = (
            <div>
                <h2>{this.state.editorHypothesis.Name}</h2>
                <div>Begin Date: {this.state.editorHypothesis.BeginDate} End Date: {this.state.editorHypothesis.EndDate}</div>
                <p>{this.state.editorHypothesis.Description}</p>
            </div>
        );
        if (this.state.editHypothesisDetails) {
    contentPanel = (
        <div>
            <h2><input type="text" value={this.state.editorHypothesis.Name}/></h2>
            <div>Begin Date: <input type="text" value = {this.state.editorHypothesis.BeginDate} />
                End Date: <input type="text" value = {this.state.editorHypothesis.EndDate} /></div>
            <p><textarea id="hypothesisDescription">{this.state.editorHypothesis.Description}</textarea></p>
        </div>
            );
}
var editHypothesisControls = (
    <button onClick={this.CancelEdit}>
        Close
    </button>
        );
if (EditorEvents.isLoggedIn) {
    editHypothesisControls = (
        <div>
            <button onClick={this.EditButtonClick}>
                Edit
            </button>
            <button onClick={this.CancelEdit}>
                Cancel
            </button>
            <button onClick={this.SaveHypothesis}>
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
                {editHypothesisControls}
            </div>
        </div>
    </div>
        );
}
});

ReactDOM.render(
    <HypothesisEditor hypothesesUrl="hypotheses" submitUrl="hypothesis/save" deleteUrl="hypothesis/delete" />,
    document.getElementById('hypothesisEditorContent')
);
