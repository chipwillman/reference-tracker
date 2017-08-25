var EditorEvents = {
    factions: [],
    references: [],
    viewpoints: [],
    hypothesis: [],
    editViewPoint: function(viewPointId) {
        alert("Editor not assigned");
    },
    editHypothesis: function(hypothesisId) {
        alert("Editor not assigned");
    },
    viewpointsChanged: function() {
        alert('Viewpoint Changed handler not assigned');
    },
    factionSelected: function(factionId, selected) {
        for (var i = 0; i < this.factions.length; i++) {
            var faction = this.factions[i];
            if (faction.FactionId === factionId) {
                faction.selected = selected;
                break;
            }
        }
        this.viewpointsChanged();
    },
    isLoggedIn: document.getElementById("logoutForm"),
    findReference: function(referenceId) {
        for (var i = 0; i < this.references.length; i++) {
            if (this.references[i].ReferenceId === referenceId) return this.references[i];
        }
        return false;
    },
    getReferenceType: function (type) {
        var referenceType = "Publicly Sourced/Debated";
        switch (type) {
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
        return referenceType;
    }
};