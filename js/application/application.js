define(['marionette', 'stickit', 'backbone'], function(Marionette, Stickit, Backbone){


MyApp = new Marionette.Application();

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


BaseView = Marionette.ItemView.extend({
  render: function() {
    Backbone.Marionette.ItemView.prototype.render.apply(this, arguments);

    this.stickit();
  }
});

PasswordView = BaseView.extend({
  template: "#password-template",
  tagName: 'tr',
  className: 'hightlighted password-item',
  
  events: {
    'click .show-hide': 'togglePassword',
    'click .disqualify': 'disqualify'
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

PasswordsView = Marionette.CompositeView.extend({
  tagName: "table",
  id: "passwords",
  className: "",
  template: "#passwords-template",
  itemView: PasswordView,
  events: {
    'click .submit': 'addNewPassword'
  },

  appendHtml: function(collectionView, itemView){
    collectionView.$("tbody").append(itemView.el);
  },

  addNewPassword: function(){
  	if(this.$el.find('.addForm [name=name]').val()!=="" && this.$el.find('.addForm [name=password]').val() !==""){
    var password = new Password({
      name: this.$el.find('.addForm [name=name]').val(),
      password: this.$el.find('.addForm [name=password]').val()
    });

    this.collection.add(password);
   }
  },

});


LoginModel = Backbone.Model.extend({
  defaults: {
    username: null,
    password: null
  },
  
  validate: function(){
    
    if(this.get('username') === 'root' && this.get('password') === 'root'){
      return true;
    }

    return false;
  }
});


LoginView = BaseView.extend({
  tagName: "div",
  id: "login",
  className: "",
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
         },
        
        
        passwords : function () {
      
          var passwords = new Passwords([
              new Password({ name: 'NASA', password: 'pewpew' }),
              new Password({ name: 'Pentagon', password: 'qwerty' }),
              new Password({ name: 'White House', password: '1234' })
          ]);
          passwords.add(new Password({
            name: 'New Media Agency',
            password: 'notapassword'
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
    routes : {
      "passwords": "passwords",
      "login": "login"
    },
    
  }));
   
});




MyApp.on("start", function(){
  Backbone.history.start();
});

// $(document).ready(function(){

//   MyApp.start();
    
// });
	return MyApp;
})