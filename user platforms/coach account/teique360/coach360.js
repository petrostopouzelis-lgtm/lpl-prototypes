/* TEIQue 360° in the coach app: shared by the assignment page, the Reports list and the results page.
   The coach's 360° (one candidate, James Okoro) is window.TEIQ_COACH_360 from data-james-okoro.js;
   its finished PDF is assets/reports/teique360-james-okoro.pdf. Both are made by
   teique-360/tools/sync-coach-account.js. */
(function () {
  var PDF = 'assets/reports/teique360-james-okoro.pdf';
  var inViewer = !!(window.claude && typeof window.claude.use === 'function');
  var downloads = inViewer ? window.claude.use('downloads').catch(function () { return null; }) : Promise.resolve(null);

  function toast(msg) { if (typeof showToast === 'function') showToast(msg); }

  // Download the finished PDF. Inside the claude.ai viewer pages cannot start a download themselves,
  // so the file goes through the viewer's downloads capability; anywhere else a plain link does it.
  function downloadPdf() {
    var name = 'TEIQue 360 Report - ' + ((window.TEIQ_COACH_360 && window.TEIQ_COACH_360.subject.name) || 'Report') + '.pdf';
    return Promise.race([downloads, new Promise(function (r) { setTimeout(function () { r(null); }, 1500); })]).then(function (dl) {
      if (!dl) {
        var a = document.createElement('a');
        a.href = PDF; a.download = name; document.body.appendChild(a); a.click(); a.remove();
        toast('Downloading the TEIQue 360° Report…');
        return;
      }
      toast('Preparing the PDF…');
      return fetch(PDF).then(function (r) { if (!r.ok) throw new Error('missing'); return r.blob(); })
        .then(function (blob) { return dl.save({ filename: name, data: blob }); })
        .then(function () { toast('PDF saved.'); })
        .catch(function (e) { if (!e || e.code !== 'declined') toast('The PDF could not be saved here.'); });
    });
  }

  var initials = function (name) { return String(name).split(/\s+/).map(function (w) { return w.charAt(0); }).join('').slice(0, 2).toUpperCase(); };
  var dmy = function (iso) {
    var M = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'], p = String(iso).split('-');
    return p.length === 3 ? (+p[2]) + ' ' + M[+p[1] - 1] + ' ' + p[0] : iso;
  };

  window.Coach360 = { PDF: PDF, downloadPdf: downloadPdf, initials: initials, date: dmy };
})();
