define(['services/datacontext',
        'durandal/plugins/router',
        'durandal/system',
        'durandal/app',
        'services/logger'],
    function (datacontext, router, system, app, logger) {
        var session = ko.observable();
        var conferenceRooms = ko.observableArray();
        var conferenceTracks = ko.observableArray();
        var conferenceTimeSlots = ko.observableArray();
        var archaives = ko.observableArray();
        var isSaving = ko.observable(false);
        var isDeleting = ko.observable(false);

        var activate = function (routeData) {
            var id = parseInt(routeData.id);
            initLookups();
            return datacontext.getSessionById(id, session);
        };

        var initLookups = function() {
            conferenceRooms(datacontext.lookups.conferencerooms);
            archaives(datacontext.lookups.archaives);
            conferenceTracks(datacontext.lookups.conferencetracks);
            conferenceTimeSlots(datacontext.lookups.conferencetimeslots);
        };

        var goBack = function () {
            router.navigateBack();
        };

        var hasChanges = ko.computed(function() {
            return datacontext.hasChanges();
        });

        var cancel = function() {
            datacontext.cancelChanges();
        };

        var canSave = ko.computed(function() {
            return hasChanges() && !isSaving();
        });
        
        var save = function () {
            isSaving(true);
            return datacontext.saveChanges().fin(complete);
            
            function complete() {
                isSaving(false);
            }
        };

        var deleteSession = function() {
            var msg = 'Delete session "' + session().title() + '" ?';
            var title = 'Confirm Delete';
            isDeleting(true);
            return app.showMessage(msg, title, ['Yes', 'No'])
                .then(confirmDelete);
            
            function confirmDelete(selectedOption) {
                if (selectedOption === 'Yes') {
                    session().entityAspect.setDeleted();
                    save().then(success).fail(failed).fin(finish);
                    
                    function success() {
                        router.navigateTo('#/sessions');
                    }
                    
                    function failed(error) {
                        cancel();
                        var errorMsg = 'Error: ' + error.message;
                        logger.logError(
                            errorMsg, error, system.getModuleId(vm), true);
                    }
                    
                    function finish() {
                        return selectedOption;
                    }
                }
                isDeleting(false);
            }
            
        };

        var canDeactivate = function () {
            if (isDeleting()) { return false; }

            if (hasChanges()) {
                var title = 'Do you want to leave "' +
                    session().title() + '" ?';
                var msg = 'Navigate away and cancel your changes?';
                return app.showMessage(title, msg, ['Yes', 'No'])
                    .then(confirm);
                
                function confirm(selectedOption)
                {
                    if (selectedOption === 'Yes') {
                        cancel();
                    }
                    return selectedOption;
                }
            }
            return true;
        };

        var vm = {
            activate: activate,
            cancel: cancel,
            canDeactivate: canDeactivate,
            canSave: canSave,
            deleteSession: deleteSession,
            goBack: goBack,
            hasChanges: hasChanges,
            conferenceRooms: conferenceRooms,
            archaives:archaives,
            conferenceTracks: conferenceTracks,
            conferenceTimeSlots: conferenceTimeSlots,
            save: save,
            session: session,
            title: 'Session Details'
        };
        return vm;
    });