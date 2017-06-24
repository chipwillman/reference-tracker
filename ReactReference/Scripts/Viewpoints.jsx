var ViewpointListItem = React.createClass({
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
        EditorEvents.editViewPoint(this.props.ViewPointId);
    },
    handleDeleteClick: function(e) {
        e.preventDefault();
        this.props.onDeleteSubmit({ ViewPointId: this.props.ViewPointId });
    },
    render: function () {
        var divStyle = {
            background: '#008888',
            padding: '10px'
        };
        if (this.state.isSelected  || this.state.hover_flag) {
            divStyle['background'] = "#008800";
        }
        if (EditorEvents.isLoggedIn) {
            return (
                <div
                    className="ViewpointBox"
                    style={divStyle}
                    onClick={this.clickHandler}
                    onMouseEnter={this.hoverEvent}
                    onMouseLeave={this.hoverEvent}>
                    <h2>{this.props.name}</h2>
                    <p>{this.props.children}</p>
                    <input type="submit" value="Delete" onClick={this.handleDeleteClick}/>
                    <input type="submit" value="Edit" onClick={this.handleEditClick} />
                </div>
            );
        } else {
            return (
                <div
                    className="ViewpointBox"
                    style={divStyle}
                    onClick={this.clickHandler}
                    onMouseEnter={this.hoverEvent}
                    onMouseLeave={this.hoverEvent}>
                    <h2>{this.props.name}</h2>
                    <p>{this.props.children}</p>
                </div>
            );
        }
    }
});

ViewpointListItem.propTypes = {
    onDeleteSubmit: React.PropTypes.object.isRequired
}

var ViewpointList = React.createClass({
    render: function() {
        var ViewpointNodes = this.props.data.map(function (Viewpoint) {
            if (Viewpoint.ViewPointId !== '')
            {
                return (
                <ViewpointListItem ViewPointId={Viewpoint.ViewPointId}
                                 onDeleteSubmit={Viewpoint.handleDeleteViewpointFromList}
                                 key={Viewpoint.ViewPointId}
                                 name={Viewpoint.Name}
                                     
                >
                    {Viewpoint.Description}
                </ViewpointListItem>
            );
            }
            return (
                <div>No results</div>
                );
        });
        return (
            <div className="commentList">
                {ViewpointNodes}
            </div>
        );
    }
});

var ViewpointForm = React.createClass({
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
        this.props.onViewpointSubmit({ Description: description, Name: name });
        this.setState({ name: '', description: '' });
    },
    render: function () {
        return (
            <form className="ViewpointForm" onSubmit={this.handleSubmit}>
                <input type="text" placeholder="Viewpoint Name" value={this.state.Name} onChange={this.handleNameChange}/>
                <input type="submit" value="Add" />
                <br />
                <textarea placeholder="Viewpoint Description..." value={this.state.Description} onChange={this.handleDescriptionChange}/>
            </form>
        );
    }
});




var ViewpointBox = React.createClass({
    loadViewpointsFromServer: function () {
        var xhr = new XMLHttpRequest();
        xhr.open('get', this.props.viewPointUrl, true);
        xhr.onload = function () {
            var data = JSON.parse(xhr.responseText);
            for (var i = 0; i < data.length; i++) {
                data[i].handleDeleteViewpointFromList = this.handleDeleteViewpointFromList;
            }
            this.setState({ data: data });
        }.bind(this);
        xhr.send();
    },
    handleViewpointSubmit: function (viewpoint) {
        var data = new FormData();
        data.append('Description', viewpoint.Description);
        data.append('Name', viewpoint.Name);

        var xhr = new XMLHttpRequest();
        xhr.open('post', this.props.viewpointSubmitUrl, true);
        xhr.onload = function () {
            this.loadViewpointsFromServer();
        }.bind(this);
        xhr.send(data);
    },
    handleDeleteViewpointFromList: function (viewpoint) {
        if (confirm("Really delete this viewpoint?")) {
            var data = new FormData();
            data.append('ViewPointId', viewpoint.ViewPointId);

            var xhr = new XMLHttpRequest();
            xhr.open('post', this.props.deleteUrl, true);
            xhr.onload = function () {
                this.loadViewpointsFromServer();
            }.bind(this);
            xhr.send(data);
        }
    },

    getInitialState: function () {
        return { data: [] };
    },
    componentWillMount: function () {
        this.loadViewpointsFromServer();
        window.setInterval(this.loadViewpointsFromServer, this.props.pollInterval);
    },
    render: function () {
        return (
            <div className="viewpointList">
                <ViewpointList data={this.state.data} />
                <ViewpointForm onviewpointSubmit={this.handleViewpointSubmit} />
            </div>
        );
        
    }
});


ReactDOM.render(
    <ViewpointBox viewPointUrl="viewpoints" viewpointSubmitUrl="viewpoints/new" deleteUrl="viewpoints/delete" pollInterval={20000} />,
    document.getElementById('viewpointsContent')
);