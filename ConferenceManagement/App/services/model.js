﻿define(['config', 'durandal/system', 'services/logger'],
    function (config, system, logger) {
    var imageSettings = config.imageSettings;
    var nulloDate = new Date(1900, 0, 1);
    var referenceCheckValidator;
    var Validator = breeze.Validator;

    var orderBy = {
        speaker: 'firstName, lastName',
        session: 'conferenceTimeSlotId, level, speaker.firstName'
    };

    var entityNames = {
        speaker: 'ConferencePerson',
        session: 'Session',
        conferenceroom: 'ConferenceRoom',
        conferencetrack: 'ConferenceTrack',
        conferencetimeslot: 'ConferenceTimeSlot',
        archaive:'Archaive' //new
    };

    var model = {
        applySessionValidators: applySessionValidators,
        configureMetadataStore: configureMetadataStore,
        createNullos: createNullos,
        entityNames: entityNames,
        orderBy: orderBy
    };

    return model;

    //#region Internal Methods
    function configureMetadataStore(metadataStore) {
        metadataStore.registerEntityTypeCtor(
            'Session', function () { this.isPartial = false; }, sessionInitializer);
        metadataStore.registerEntityTypeCtor(
            'ConferencePerson', function () { this.isPartial = false; }, personInitializer);
        metadataStore.registerEntityTypeCtor(
            'ConferenceTimeSlot', null, timeSlotInitializer);

        referenceCheckValidator = createReferenceCheckValidator();
        Validator.register(referenceCheckValidator);
        log('Validators registered');
    }
    
    function createReferenceCheckValidator() {
        var name = 'realReferenceObject';
        var ctx = { messageTemplate: 'Missing1 %displayName%' };
        var val = new Validator(name, valFunction, ctx);
        log('Validators created');
        return val;
        
        function valFunction(value, context) {
            return value ? value.id() !== 0 : true;
        }
    }
        
    function applySessionValidators(metadataStore) {
        var types = ['conferenceRoom', 'conferenceTrack', 'conferenceTimeSlot', 'speaker', 'archaive'];
        types.forEach(addValidator);
        log('Validators applied', types);
        
        function addValidator(propertyName) {
            var sessionType = metadataStore.getEntityType('Session');
            sessionType.getProperty(propertyName)
                .validators.push(referenceCheckValidator);
        }
    }
    
    function createNullos(manager) {
        var unchanged = breeze.EntityState.Unchanged;

        createNullo(entityNames.conferencetimeslot, {start: nulloDate, isSessionSlot: true});
        createNullo(entityNames.conferenceroom);
        createNullo(entityNames.conferencetrack);
        createNullo(entityNames.archaive); //new
        createNullo(entityNames.speaker, { firstName: ' [Select a Speaker]'  });

        function createNullo(entityName, values) {
            var initialValues = values
                || { name: ' [Select a ' + entityName.toLowerCase() + ']' };
            return manager.createEntity(entityName, initialValues, unchanged);
        }

    }

    function sessionInitializer(session) {
        session.tagsFormatted = ko.computed({
            read: function () {
                var text = session.tags();
                return text ? text.replace(/\|/g, ', ') : text;
            },
            write: function (value) {
                session.tags(value.replace(/\, /g, '|'));
            }
        });
    }

    function personInitializer(conferencePerson) {
        conferencePerson.fullName = ko.computed(function () {
            var fn = conferencePerson.firstName();
            var ln = conferencePerson.lastName();
            return ln ? fn + ' ' + ln : fn;
        });
        conferencePerson.imageName = ko.computed(function () {
            return makeImageName(conferencePerson.imageSource());
        });
    };
    
    function timeSlotInitializer(conferenceTimeSlot) {
        conferenceTimeSlot.name = ko.computed(function () {
            var start = conferenceTimeSlot.start();
            var value = ((start - nulloDate) === 0) ?
                ' [Select a conference timeslot]' :
                (start && moment.utc(start).isValid()) ?
                    moment.utc(start).format('ddd hh:mm a') : '[Unknown]';
            return value;
        });
    }
    
    function makeImageName(source) {
        return imageSettings.imageBasePath +
            (source || imageSettings.unknownPersonImageSource);
    }

    function log(msg, data, showToast) {
        logger.log(msg, data, system.getModuleId(model), showToast);
    }
    //#endregion
});