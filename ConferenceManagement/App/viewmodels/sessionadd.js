define(['durandal/app', 'services/datacontext', 'durandal/plugins/router'],
    function (app, datacontext, router) {
        var isSaving = ko.observable(false),
            conferenceRooms = ko.observableArray(),
            session = ko.observable(),
            speakers = ko.observableArray(),
            conferenceTimeSlots = ko.observableArray(),
            conferenceTracks = ko.observableArray(),
            archaives = ko.observableArray(); //new

            activate = function () {
                initLookups();
                session(datacontext.createSession());
            },
            initLookups = function () {
                conferenceRooms(datacontext.lookups.conferencerooms);
                archaives(datacontext.lookups.archaives); //new
                conferenceTimeSlots(datacontext.lookups.conferencetimeslots);
                conferenceTracks(datacontext.lookups.conferencetracks);
                speakers(datacontext.lookups.speakers);
                archaives(datacontext.lookups.archaives);
            },
            cancel = function (complete) {
                router.navigateBack();
            },
            hasChanges = ko.computed(function () {
                return datacontext.hasChanges();
            }),
            canSave = ko.computed(function () {
                return hasChanges() && !isSaving();
            }),
            save = function () {
                isSaving(true);
                datacontext.saveChanges()
                    .then(goToEditView).fin(complete);

                function goToEditView(result) {
                    router.replaceLocation('#/sessiondetail/' + session().id());
                }

                function complete() {
                    isSaving(false);
                }
            },
            canDeactivate = function () {
                if (hasChanges()) {
                    var msg = 'Do you want to leave and cancel?';
                    return app.showMessage(msg, 'Navigate Away', ['Yes', 'No'])
                        .then(function (selectedOption) {
                            if (selectedOption === 'Yes') {
                                datacontext.cancelChanges();
                            }
                            return selectedOption;
                        });
                }
                return true;
            };

        var vm = {
            activate: activate,
            canDeactivate: canDeactivate,
            canSave: canSave,
            cancel: cancel,
            hasChanges: hasChanges,
            conferenceRooms: conferenceRooms,
            save: save,
            session: session,
            speakers: speakers,
            conferenceTimeSlots: conferenceTimeSlots,
            title: 'Add a New Session',
            conferenceTracks: conferenceTracks,
            archaives:archaives
        };

        return vm;
    });