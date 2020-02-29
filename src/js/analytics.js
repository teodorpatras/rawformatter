/* eslint-disable */

(function(i, s, o, g, r, a, m) {
  i["GoogleAnalyticsObject"] = r;
  (i[r] =
    i[r] ||
    function() {
      (i[r].q = i[r].q || []).push(arguments);
    }),
    (i[r].l = 1 * new Date());
  (a = s.createElement(o)), (m = s.getElementsByTagName(o)[0]);
  a.async = 1;
  a.src = g;
  m.parentNode.insertBefore(a, m);
})(
  window,
  document,
  "script",
  "https://www.google-analytics.com/analytics.js",
  "ga"
);

class Analytics {
  constructor(trackerId, userId) {
    this._trackerId = trackerId;
    this._userId = userId;
    this._init();
  }

  setConfig(userId) {
    this._userId = userId;
    this._init();
  }

  track(trackingType, action, category, label) {
    if (!trackingType || !action || !category || !label) {
      throw new Error("Missing tracking information");
    }

    ga("send", {
      hitType: trackingType,
      eventCategory: category,
      eventAction: action,
      eventLabel: label
    });
  }

  _init() {
    const config = this._userId ? { userId: this._userId } : "auto";
    if (!this._trackerId) {
      throw new Error("No tracker id specified!");
    }
    ga("remove");
    ga("create", this._trackerId, config);
    // Removes failing protocol check. @see: http://stackoverflow.com/a/22152353/1958200
    ga("set", "checkProtocolTask", () => {});
    ga("require", "displayfeatures");
  }
}

try {
  module.exports = { Analytics };
} catch (_) {}
