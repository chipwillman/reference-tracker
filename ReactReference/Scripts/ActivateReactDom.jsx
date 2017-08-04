
ReactDOM.render(
    <FactionBox url="factions" submitUrl="factions/new" deleteUrl="factions/delete" pollInterval={20000} />,
    document.getElementById('factionContent')
);

ReactDOM.render(
    <ViewpointBox viewPointUrl="viewpoints" viewpointSubmitUrl="viewpoints/new" deleteUrl="viewpoints/delete" pollInterval={20000} />,
    document.getElementById('viewpointsContent')
);

ReactDOM.render(
    <HypothesisBox hypothesisUrl="hypotheses" hypothesisSubmitUrl="hypotheses/new" deleteUrl="hypotheses/delete" pollInterval={20000} />,
    document.getElementById('hypothesesContent')
);

ReactDOM.render(
    <ViewpointEditor
        viewPointUrl="viewpoints"
        submitViewpointUrl="viewpoints/save"
        submitDeleteViewpointUrl="viewpoints/delete"
        submitReferenceUrl="references/new"
        submitEvidenceUrl="evidence/new"
        submitSaveEvidenceUrl="evidence/save"
        submitDeleteEvidenceUrl="evidence/delete"
    />,
    document.getElementById('viewpointEditorContent')
);


ReactDOM.render(
    <ReferenceBox referenceUrl="references" submitSaveEvidenceUrl="references/new" deleteUrl="references/delete" pollInterval={60000} />,
    document.getElementById('referencesFilterContent')
);