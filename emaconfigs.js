var proj  = project('fast_flash_card');
function ids(coll, query) { return coll.find(query).map(it=>it._id) };
var instruments = ids(db.instrument, {project: proj._id});
function badTrigX(coll) {
    var configs = ids(db.instrumentConfig, {instrument: {$in: instruments}});
    var surveys = ids(db.emaOtsCardstack, {configuration: {$in: configs}})
    var triggers = ids(db.trigger, {configuration: {$in: configs}})
    coll.find({trigger: {$in: triggers}, survey: {$exists: 1, $nin: surveys}})
        .forEach(te => 
            db.trigger.find({_id: te.trigger})
            .forEach(trig =>
                db.instrumentConfig.find({_id: trig.configuration})
                .forEach(config =>
                    printjson([config.code, trig.code, te])
        )));
}
//badTrigX(db.triggerEvent)
//db.triggerEvent.remove({_id: {$in: ['5abbe369e4b0c24002e3dc7d', '5abbe5c4e4b0c24002e3dcbe']}})
//db.triggerAction.find({trigger: {$in: triggers}, survey: {$exists: 1, $nin: surveys}})
