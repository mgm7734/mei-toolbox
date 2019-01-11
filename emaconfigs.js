print('*********** emaconfig.js')

/*
 * find and optianlly fix dangling survey references
 */
function badTrigs(projCode, fixIt) {
    var proj = db.project.findOne({code: projCode})
    db.instrument.find({project: proj._id}).forEach(instrument => { 
        db.instrumentConfig.find({instrument: {$in: instruments}}).forEach(config => {
            var surveys = ids(db.emaOtsCardstack, {configuration: config._id})
            var triggers = ids(db.trigger, {configuration: config._id})
            db.triggerAction.find({ trigger: { $in: triggers },
                                    survey: { $exists: 1, $nin: surveys }})
                .forEach(badAction => {
                    var trigCode = db.trigger.findOne({_id: badAction.trigger}).code
                    printjson([config.code, trigCode, badAction.survey, badAction])
                    if (fixIt) {
                        var result = db.triggerAction.update(
                            {_id: badAction._id},
                            {$set: {_bad_survey: badAction.survey, survey: surveys[0]}})
                        printjson([ '==>', surveys[0], result ])
                    }

            })
        })
    })
}


//badTrigX(db.triggerEvent)
//db.triggerEvent.remove({_id: {$in: ['5abbe369e4b0c24002e3dc7d', '5abbe5c4e4b0c24002e3dcbe']}})
//db.triggerAction.find({trigger: {$in: triggers}, survey: {$exists: 1, $nin: surveys}})
