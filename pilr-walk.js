var rels = [
    // childEntity, property, parentEnttty
    ["device", "participant", "participant"],
    ["period", "project", "project"],
    ["groupCategory", "project", "project"],
    ["tag", "project", "project"],
    ["eventBundle", "project", "project"],
    ["quickPlotItem", "project", "project"],
    ["eventBundleEvent", "eventBundle", "eventBundle"],
    ["tool", "project", "project"],
    ["periodSchedule", "template", "template"],
    ["group_", "groupCategory", "groupCategory"],
    ["apiConsumer", "project", "project"],
//    ["liitahPublicVenue", "project", "project"],
//    ["liitahMealType", "project", "project"],
//    ["liitahParticipantFoodSuggestion", "participant", "participant"],
    ["instrument", "project", "project"],
    ["instrumentApplication", "instrument", "instrument"],
    ["instrumentConfig", "instrument", "instrument"],
    ["dashboard", "project", "project"],
    ["activeVariableDef", "template", "template"],
    ["variableDef", "project", "project"],
    ["epoch", "period", "period"],
    ["participant", "project", "project"],
    ["periodTemplate", "group", "group_"],
    ["activeInstrument", "template", "template"],
    ["template", "project", "project"],
    ["job", "project", "project"],
    ["jobDef", "project", "project"],
    ["epochSchedule", "periodSchedule", "periodSchedule"],
    ["fileHandler", "project", "project"],
    ["dataset", "project", "project"],
    ["schema", "dataset", "dataset"],
    ["participantUpload", "participant", "participant"],
    ["organizationDefinition", "organization", "organization"],
    ["mmmGroupSummary", "group", "group"],
    ["appPlusDrug", "project", "project"],
    ["appPlusInfoCard", "project", "project"],
    ["appPlusStoryCard", "project", "project"],
 //   ["liitahFoodSuggestion", "publicVenue", "liitahPublicVenue"],
//    ["liitahMealTailoredMessage", "participant", "participant"],
    ["trigger", "configuration", "instrumentConfig"],
    ["triggerCondition", "trigger", "trigger"],
    ["triggerAction", "trigger", "trigger"],
    ["triggerEvent", "trigger", "trigger"],
    ["emaOtsTriggerCriteriaCondition", "criteria", "emaOtsTriggerCriteria"],
    ["emaOtsTriggerCriteriaAction", "criteria", "emaOtsTriggerCriteria"],
    ["emaOtsTriggerCriteria", "configuration", "instrumentConfig"],
    ["emaOtsTriggerCriteriaTrigger", "criteria", "emaOtsTriggerCriteria"],
    ["activityJournal", "configuration", "instrumentConfig"],
    ["activity", "journal", "activityJournal"],
    ["emaOtsCardstack", "configuration", "instrumentConfig"],
];
// TODO: authorization?, files, dataset data



function sanityCheck() {
    rels.forEach(rel => {
        var child = db[rel[0]].findOne();
        if (!child)
            printjsononeline(["no child entity", rel])
        else if (child && !child[rel[1]])
            printjsononeline(["no parent", rel])
    });
}

var parent2childRels = {};
rels.forEach(([child, prop, parent]) => {
    if (!parent2childRels[parent])
        parent2childRels[parent] = [[child, prop]];
    else
        parent2childRels[parent].push([child, prop]);
});


function _defaultErrorHandler(msg, ent, id) { throw {name: 'walkError', message:msg, collection: ent, id: id}}

function walkIds(parentEnt, ids, fns) {
    if (ids.length == 0)
        return;
    if (fns.before)
        fns.before(parentEnt, ids);
    var rels = parent2childRels[parentEnt];
    //printjsononeline([parentEnt, ids, rels]);
    if (rels) {
        rels.forEach(([childEnt, prop]) => {
            var childIds = db[childEnt].find({[prop]: {$in: ids}}, {_id: 1}).map(d=>d._id);
            walkIds(childEnt, childIds, fns);
        })
    }
    if (fns.after)
        fns.after(parentEnt, ids);
}

 var r = {};
function testIt() {
    var proj = project(/./);
    walkIds('project', [proj._id], {before: (ent, ids) => r[ent] = ids});
}
testIt()
