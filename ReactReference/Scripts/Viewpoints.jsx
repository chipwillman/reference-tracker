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
    handleEditViewpointClick: function(e) {
        EditorEvents.editViewPoint(this.props.ViewPointId);
    },
    handleDeleteClick: function(e) {
        e.preventDefault();
        this.props.onDeleteSubmit({ ViewPointId: this.props.ViewPointId });
    },
    render: function () {
        var divStyle = {
            background: '#008888',
            padding: '10px',
            margin: '10px'
        };
        var controlBar = (
            <input type="submit" value="View" onClick={this.handleEditViewpointClick} />
            );
        if (EditorEvents.isLoggedIn) {
            controlBar = (
                <div>
                    <input type="submit" value="Delete" onClick={this.handleDeleteClick}/>
                    <input type="submit" value="Edit" onClick={this.handleEditViewpointClick}/>
                </div>
            );
        }
        if (this.state.isSelected  || this.state.hover_flag) {
            divStyle['background'] = "#008800";
        }
        return (
            <div
                className="ViewpointBox"
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

var ViewpointList = React.createClass({
    render: function () {
        var self = this;
        var ViewpointNodes = this.props.data.map(function (Viewpoint) {
            if (Viewpoint.ViewPointId !== '')
            {
                return (
                <ViewpointListItem ViewPointId={Viewpoint.ViewPointId}
                                 onDeleteSubmit={self.props.onHandleDeleteViewpointFromList}
                                 key={Viewpoint.ViewPointId}
                                 name={Viewpoint.Name} >
                    {Viewpoint.Description}
                </ViewpointListItem>
            );
            }
            return (
                <div>No results</div>
                );
        });
        return (
            <div className="ViewpointList" key="ViewpointList">
                {ViewpointNodes}
            </div>
        );
    }
});

var ViewpointForm = React.createClass({
    getInitialState: function () {
        return { name: '', description: '', beginDate: '' };
    },
    handleNameChange: function (e) {
        this.setState({ name: e.target.value });
    },
    handleDescriptionChange: function (e) {
        this.setState({ description: e.target.value });
    },
    handleBeginDateChange: function (e) {
        this.setState({ beginDate: e.target.value });
    },
    handleSubmit: function (e) {
        e.preventDefault();
        var name = this.state.name.trim();
        var description = this.state.description.trim();
        var beginDate = this.state.beginDate.trim();
        if (!name || !description || !beginDate) {
            return;
        }
        this.props.onViewpointSubmit({ Description: description, Name: name, BeginDate: beginDate });
        this.setState({ name: '', description: '', beginDate: '' });
    },
    render: function () {
        var textareaStyle = {
            width: "347px",
            height: "90px"
        };
        return (
            <form className="ViewpointForm" onSubmit={this.handleSubmit}>
                <input type="text" placeholder="Viewpoint Name" value={this.state.name} onChange={this.handleNameChange} />
                <input type="text" placeholder="Date" value={this.state.beginDate} onChange={this.handleBeginDateChange} />
                <textarea style={textareaStyle} placeholder="Viewpoint Description..." value={this.state.Description} onChange={this.handleDescriptionChange}/>
                <br />
                <input type="submit" value="Add" />
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
            this.setState({ data: data });
        }.bind(this);
        xhr.send();
    },
    handleViewpointSubmit: function (viewpoint) {
        var data = new FormData();
        data.append('Description', viewpoint.Description);
        data.append('Name', viewpoint.Name);
        data.append('BeginDate', viewpoint.BeginDate);

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
        var addViewpointForm = (
            <p>Log in to add a viewpoint</p>
        );
        if (EditorEvents.isLoggedIn) {
            addViewpointForm = (
                <ViewpointForm onViewpointSubmit={this.handleViewpointSubmit} />
            );
        } 

        return (
            <div className="ViewpointList">
                <ViewpointList data={this.state.data} onHandleDeleteViewpointFromList={this.handleDeleteViewpointFromList} />
                {addViewpointForm}
            </div>
        );
        
    }
});


ReactDOM.render(
    <ViewpointBox viewPointUrl="viewpoints" viewpointSubmitUrl="viewpoints/new" deleteUrl="viewpoints/delete" pollInterval={20000} />,
    document.getElementById('viewpointsContent')
);