var ViewpointEditor = React.createClass({
    getInitialState: function () {
        return { show: false, viewpointId: '' };
    },
        CancelEdit(e) {
            this.setState({ show: false });
    },
    LoadViewpoint(viewpointId) {
        var xhr = new XMLHttpRequest();
        var address = this.props.viewPointUrl + "/" + viewpointId;
        xhr.open('get', address, true);
        xhr.onload = function () {
            var viewpoint = JSON.parse(xhr.responseText);
            this.setState({ editorViewpoint: viewpoint });
        }.bind(this);
        xhr.send();
    },
    EditViewPoint(viewpointId) {
        this.LoadViewpoint(viewpointId);
        this.setState({ show: true });
    },
    componentWillMount: function () {
        EditorEvents.editViewPoint = this.EditViewPoint;
        window.setInterval(this.loadViewPointsFromServer, this.props.pollInterval);
    },
    render()
    {
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
        return (
            <div>
            <div className="backdrop" style={backdropStyle}>
            </div>
            <div className="modal" style={modalStyle}>
                <h2>{this.state.editorViewpoint.Name}</h2>
                <div>Begin Date: {this.state.editorViewpoint.BeginDate} End Date: {this.state.editorViewpoint.EndDate}</div>
                <p>{this.state.editorViewpoint.Description}</p>

                <div className="footer">
                    <button onClick={this.CancelEdit}>
                        Cancel
                    </button>
                </div>
            </div>
            </div>
        );
    }
});

ReactDOM.render(
    <ViewpointEditor viewPointUrl="viewpoints" submitUrl="viewpoint/save" deleteUrl="viewpoint/delete" />,
    document.getElementById('viewpoitnEditorContent')
);
