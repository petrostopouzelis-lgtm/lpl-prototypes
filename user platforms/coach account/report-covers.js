/* Canonical report cover paths — filenames from 006_RASTER/report covers/ */
(function (global) {
    var BASE = 'assets/report-covers/';

    /* Exact filenames in the raster library */
    var FILES = {
        personal: 'personal.png',
        corporate: 'corporate.png',
        leadership: 'leadership.png',
        developmental: 'developmental.png',
        recruitment: 'recruitment.png',
        teamReport: 'teams.png',
        compatibility: 'compatibility.png',
        groupSort: 'team-grouping.png',
        rolesync: 'rolesync.png',
        scanin: 'scan-in.png',
        threeRs: '3rs-sample.png',
        teique360: 'teique-360.png'
    };

    /* Wizard / inventory report display names → library file */
    var BY_REPORT_NAME = {
        'Personal': FILES.personal,
        'Corporate': FILES.corporate,
        'Leadership': FILES.leadership,
        'Developmental': FILES.developmental,
        'Recruitment': FILES.recruitment,
        'Team Report': FILES.teamReport,
        'Compatibility': FILES.compatibility,
        'Group-Sort': FILES.groupSort,
        'RoleSync': FILES.rolesync,
        'TEIQue 360°': FILES.teique360
    };

    function coverPath(filename) {
        if (!filename) return '';
        return BASE + encodeURI(filename);
    }

    function coverForReport(reportName) {
        return coverPath(BY_REPORT_NAME[reportName] || '');
    }

    global.REPORT_COVER_BASE = BASE;
    global.REPORT_COVER_FILES = FILES;
    global.coverForReport = coverForReport;
    global.coverPath = coverPath;
})(typeof window !== 'undefined' ? window : this);
