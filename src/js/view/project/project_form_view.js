app.view.Project.Form = Backbone.View.extend({
    _template : _.template( $('#project_form_template').html() ),
    _templateMembers: _.template( $('#project_form_members_template').html() ),

    initialize: function(options) {

        this.datalist = new Backbone.Collection(app.userlist.models);

        if (options.slug){
            var _this = this;
            this.model = new app.model.Project({ "slug" : options.slug});
            this.model.fetch({
                success : function(model){
                    _this._initialize();
                }
            });

        }
        else{
            this.model = new app.model.Project();
            this.model.set("members",new Backbone.Collection([]));
            this._initialize();
        }

    },

    _initialize: function(){

        this._updateDataList();

        this.listenTo(this.model.get("members"),"add remove",function(){
            this._updateDataList();
            this.renderMembers();
        });

        this.listenTo(this.datalist,"reset",this.renderDataList);

        Backbone.Validation.bind(this);

        this.render();
    },

    events: {
        "click #addmember" : "addMember",
        "change select[name='type_rate']": "changeTypeRate",
        "blur input[data-model]" : "inputToModel",
        "blur select[name='status']" : "changeStatus",
        "click #save": "save",
        "blur .hourlyrate input[data-member-idx]" : "changeMemberHourlyRate",
        "click .remove_member": "deleteMember",
        "click .set_manager": "setMemberAsManager"
    },

    onClose: function(){
        // Remove events on close
        this.stopListening();
    },

    renderMembers: function(){
        this.$members.html(this._templateMembers({
            model : this.model.toJSON()
        }));

        return this;
    },

    renderDataList: function(){
        var html = "",
            data = this.datalist.toJSON();

        _.each(data,function(u){
            html += "<option value='" + u.name + " " + u.surname + "'>";
        });

        this.$datalist.html(html);

        return this;
    },

    render: function() {
        this.$el.html(this._template({
            model : this.model.toJSON(),
        }));
        this.$members = this.$("#members");
        this.$datalist = this.$("datalist#allusers");
        this.renderMembers();
        this.renderDataList();

        return this;
    },

    _updateDataList: function(){
        var allusers = app.userlist.toJSON(),
            members = this.model.get("members").pluck("id_user"),
            toInsert = [];

        _.each(allusers,function(u){
            if (members.indexOf(u._id) == -1){
                toInsert.push(u);
            }
        });

        this.datalist.reset(toInsert);
    },

    addMember: function (e){
        e.preventDefault();

        var $addmember = this.$("input[name='addmember']"),
            user = app.userlist.getUserByCN($addmember.val().trim());

        // add user to members. It refresh member list
        this.model.get("members").add({
            "id_user" : user.get("_id"),
            "hourly_rate" : app.config.DEFAULT_PRICE_HOUR
        });

        $addmember.val("");

    },

    changeTypeRate: function(e){
        var $e = $(e.target),
            type = $e.val();

        if (type==1){
            this.$("input[name='hourly_rate']").show();
            this.$(".hourlyrate").hide();
        }
        else{
            this.$("input[name='hourly_rate']").hide();
            this.$(".hourlyrate").show();
        }

        this.model.set("type_rate",type);

    },

    changeStatus: function(e){
        var $e = $(e.target),
            status = $e.val();

        this.model.set("status",status);

    },

    inputToModel: function(e){
        var $e = $(e.target),
            name = $e.attr("name");

        this.model.set(name,app.input($e.val()));
    },

    save: function(e){
        e.preventDefault();

        if (this.model.isValid(true)){
            // Save on server
            this.model.save(null,{
                success: function(model,response){
                    app.router.navigate("projects/" + response.slug,{trigger: true});
                }
            });
        }
        else{
            app.scrollTop();
        }
    },

    changeMemberHourlyRate: function(e){
        var $e = $(e.target),
            idx = $e.attr("data-member-idx"),
            members = this.model.get("members"),
            member = members.at(idx);

        member.set("hourly_rate",app.input($e.val()))
    },

    deleteMember: function(e){
        e.preventDefault();

        var r = confirm("Are you sure?");

        if (r){
            var $e = $(e.target),
                idx = $e.attr("data-member-idx"),
                members = this.model.get("members"),
                member = members.at(idx);

            members.remove(member);
        }
    },

    setMemberAsManager: function(e){
      e.preventDefault();

      var r = confirm("Are you sure?");
      
      if (r){
          var $e = $(e.target),
              idx = $e.attr("data-member-idx"),
              members = this.model.get("members"),
              member = members.at(idx);

          this.model.setMemberAsManager(member);
      }
    }
});
