var index = {
  template: document.getElementById('index-page'),
  data: function() {
    return {
      logo: null,
      nickname: null,
      signature: null
    }
  },
  created: function() {
    var self = this;
    getJson(
      'api/userinfo',
      {},
      function(ret) {
        if (ret.code == 200) {
          self.logo = config.imgBasePath + ret.data.logo;
          self.nickname = ret.data.nickname;
          self.signature = ret.data.signature;
        }
      },
      null,
      true
    );
  },
  methods: {
    goPage: function(page) {
      go(page, true)
    }
  }
}

var nickname = {
  template: document.getElementById('nickname-page'),
  data: function() {
    return {
      nickname: this.$route.query.nickname
    }
  },
  methods: {
    setNickname: function() {
      var self = this;
      postJson(
        'api/user/setNickname',
        {
          nickname: self.nickname
        },
        function(ret) {
          if (ret.code == 200) {
            self.$router.back();
          }
        }
      );
    }
  }
}

var sign = {
  template: document.getElementById('sign-page'),
  data: function() {
    return {
      signature: this.$route.query.signature
    }
  },
  methods: {
    setSign: function() {
      var self = this;
      postJson(
        'api/user/setSign',
        {
          signature: self.signature
        },
        function(ret) {
          if (ret.code == 200) {
            self.$router.back();
          }
        }
      );
    }
  }
}
var router = new VueRouter({
  routes: [
    {path: '/', component: index },
    {path: '/nickname', component: nickname},
    {path: '/sign', component: sign}

  ]
})

var vm = new Vue({
  router: router
}).$mount('#main');