/* Canonical report cover paths — filenames from 006_RASTER/report covers/ */
(function (global) {
    var BASE = '../../006_RASTER/report covers/';

    /* Exact filenames in the raster library */
    var FILES = {
        personal: 'personal cover 2023-01.png',
        corporate: 'corporate cover 2023-01.png',
        leadership: 'leadership cover 2023-01.png',
        developmental: 'developmental cover-01.png',
        recruitment: 'recruitment cover 2023-01.png',
        teamReport: 'Teams Cover 2023-01.png',
        compatibility: 'compatibility report cover 3-01.png',
        groupSort: 'Team Grouping Cover 2023 blank-01.png',
        rolesync: 'RoleSync  Cover full.png',
        scanin: 'Scan-In Cover 2023 3-01.png',
        threeRs: '3RS sample cover.png'
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
        'RoleSync': FILES.rolesync
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
