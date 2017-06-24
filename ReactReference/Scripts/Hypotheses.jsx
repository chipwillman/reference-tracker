var Viewpoint = React.createClass({
    render: function() {
        return (
            <div className="active">
                <ul>
                    <li>King Charlemagne</li>
                    <li>Phantom Time Hypothesis</li>
                    <li>New Chronology</li>
                    <li>Scaliger</li>
                </ul>
            </div>
        );
    }
});
ReactDOM.render(
    <Viewpoint />,
    document.getElementById('hypothesesContent')
);