
const URLS = {
    STATE_COUNT : '/service/business/module/digest'
}

module.exports = {
    getStateCount(){
        var currentUser = GlobalService.getCurrentUserSync();
        var relationEntityIds = [];
        if(currentUser.relation.office&&currentUser.relation.office.id){
            relationEntityIds.push(currentUser.relation.office.id);
        }
        if(currentUser.relation.hospital[0].id){
            relationEntityIds.push(currentUser.relation.hospital[0].id);
        }
        currentUser.relation.teams&&currentUser.relation.teams.forEach(team=>{
            relationEntityIds.push(team.id);
        });
        return $http({
            url  : URLS.STATE_COUNT,
            data : {
                currentUserRoles : GlobalService.getCurrentUserSync().relation.officesDesc,
                systemId : GlobalService.getSystemId(),
                hospitalId : currentUser.relation.hospital[0].id,
                relationEntityIds : relationEntityIds.join(',')
            }
        })
    }
}