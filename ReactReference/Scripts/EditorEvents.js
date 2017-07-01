var EditorEvents =  {
    factions: [],
    references: [],
    editViewPoint: function (viewPointId) {
        alert("Editor not assigned");
    },
    editHypothesis: function (hypothesisId) {
        alert("Editor not assigned");
    },
    isLoggedIn: document.getElementById("logoutForm"),
    findReference: function(referenceId) {
        for (var i = 0; i < this.references.length; i++) {
            if (this.references[i].ReferenceId === referenceId) return this.references[i];
        }
        return false;
    }
};