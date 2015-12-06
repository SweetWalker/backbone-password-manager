define(['marionette'], function(Marionette){
MyApp = new Backbone.Marionette.Application();

MyApp.addRegions({
  mainRegion: "#content"
});

Password = Backbone.Model.extend({
  defaults: {
    name: null,
    password: null,
    show: false
  }
});

Passwords = Backbone.Collection.extend({
  model: Password,
  
  initialize: function(){
    
  }
});


BaseView = Backbone.Marionette.ItemView.extend({
  render: function() {
    Backbone.Marionette.ItemView.prototype.render.apply(this, arguments);

    this.stickit();
  }
});

PasswordView = BaseView.extend({
  template: "#password-template",
  tagName: 'tr',
  className: 'password-item',
  
  events: {
    'click .show-hide': 'togglePassword',
    'click a.disqualify': 'disqualify'
  },
  
  bindings: {
    '[name=show]': {
      observe: 'show',
      updateView: true
    }
  },

  initialize: function(){
    _.once(function(){
      window.qwe = this.model;
    }.bind(this))();

    this.listenTo(this.model, 'change:show', this.render);
  },
  
  togglePassword: function(){
    //there will be some logic
  },
  
  disqualify: function(){
    this.model.destroy();
    MyApp.trigger("password:disqualify", this.model);
  }
});

PasswordsView = Backbone.Marionette.CompositeView.extend({
  tagName: "table",
  id: "passwords",
  className: "table-striped table-bordered",
  template: "#passwords-template",
  itemView: PasswordView,
  events: {
    'click .submit': 'addNewPassword'
  },

  appendHtml: function(collectionView, itemView){
    collectionView.$("tbody").append(itemView.el);
  },

  addNewPassword: function(){
    debugger;
    var password = new Password({
      name: this.$el.find('.addForm [name=name]').val(),
      password: this.$el.find('.addForm [name=password]').val()
    });

    this.collection.add(password);
   
  },

});


LoginModel = Backbone.Model.extend({
  defaults: {
    username: null,
    password: null
  },
  
  validate: function(){
    
    if(this.get('username') === 'huehue' && this.get('password') === 'huehue'){
      return true;
    }

    return false;
  }
});


LoginView = BaseView.extend({
  tagName: "div",
  id: "login",
  className: "table-striped table-bordered",
  template: "#login_template",
  
  events: {
    "submit form": "login" 
  },

  bindings: {
    '[name=username]': 'username',
    '[name=password]': 'password'
  },

  login: function(e){
    
      if(this.model.validate()){
        window.location.hash = 'passwords';
      } else {
        alert('Password or login is incorrect');
      }

      e.preventDefault();
  },

  initialize: function(){
    this.model = new LoginModel();
  }
});




var Controller = Marionette.Controller.extend({
        initialize : function(options) {
             //TODO: code to initialize
         },
        
        /**
         * Initialized on start, without hash
         * @method
         */
        passwords : function () {
      
          var passwords = new Passwords([
              new Password({ name: 'Wet Cat', password: 'tetst' }),
              new Password({ name: 'Bitey Cat', password: 'testest' }),
              new Password({ name: 'Surprised Cat', password: 'qweqweqweqweqwe' })
          ]);
          passwords.add(new Password({
            name: 'Cranky Cat',
            password: 'qweqweqwe'
          }));

          var passwordView = new PasswordsView({
            collection: passwords
          });
          MyApp.mainRegion.show(passwordView);
        },
        login: function() {
         
          var loginView = new LoginView();
          MyApp.mainRegion.show(loginView);
        }
    });
 

MyApp.addInitializer(function(options){
  var Router = new (Marionette.AppRouter.extend({
    controller: new Controller(),
    appRoutes: {
      "passwords": "passwords",
      "login": "login"
    },
    /* standard routes can be mixed with appRoutes/Controllers above */
    routes : {
      "passwords": "passwords",
      "login": "login"
    },
    
  }));
   
});




MyApp.on("initialize:after", function(){
  // Start Backbone history a necessary step for bookmarkable URL's
  Backbone.history.start();
});

$(document).ready(function(){

  MyApp.start();
    
});

})