import router from "@/router";
// https://github.com/vacu/electron-google-analytics
import Analytics from "electron-google-analytics";

const analytics = new Analytics("UA-143962898-1");
const macaddress = require("macaddress");

router.afterEach((to, from) => {
  macaddress.one(function(err, mac) {
    analytics
      .pageview("http://hexoclient.mspring.org", to.fullPath, to.name, 1, mac)
      .then(response => {
        console.log("统计", response);
      })
      .catch(err => {
        console.error("统计异常", err);
      });
  });
});

class ClientAnalytics {
  // Analytics#event(evCategory, evAction, { evLabel, evValue, clientID })
  event(evCategory, evAction, options) {
    this.getClientId(function(clientId) {
      options = options || {};
      options.clientID = clientId;
      analytics
        .event(evCategory, evAction, options)
        .then(response => {
          console.log("send event", evCategory, evAction, options, response);
        })
        .catch(err => {
          console.error("send event error", err);
        });
    });
  }

  getClientId(callback) {
    var me = this;
    if (this.clientId) {
      callback(me.clientId);
    } else {
      macaddress.one(function(err, mac) {
        me.clientId = mac;
        callback(mac);
      });
    }
  }
}

export default new ClientAnalytics();
