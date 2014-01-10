const St = imports.gi.St;
const Main = imports.ui.main;
const PopupMenu = imports.ui.popupMenu;
const PanelMenu = imports.ui.panelMenu;
const Lang = imports.lang;
const Calendar = imports.ui.calendar;
const Mainloop = imports.mainloop;
const Clutter = imports.gi.Clutter;
const DBus = imports.dbus;
const Shell = imports.gi.Shell;
const Gvc = imports.gi.Gvc;
const Signals = imports.signals;
const Util = imports.misc.util;
const Panel = imports.ui.panel;



function _from_utf8(s) 
{
	  var c, d = "", flag = 0, tmp;
	  for (var i = 0; i < s.length; i++) {
	    c = s.charCodeAt(i);
	    if (flag == 0) {
	      if ((c & 0xe0) == 0xe0) {
	        flag = 2;
	        tmp = (c & 0x0f) << 12;
	      } else if ((c & 0xc0) == 0xc0) {
	        flag = 1;
	        tmp = (c & 0x1f) << 6;
	      } else if ((c & 0x80) == 0) {
	        d += s.charAt(i);
	      } else {
	        flag = 0;
	      }
	    } else if (flag == 1) {
	      flag = 0;
	      d += String.fromCharCode(tmp | (c & 0x3f));
	    } else if (flag == 2) {
	      flag = 3;
	      tmp |= (c & 0x3f) << 6;
	    } else if (flag == 3) {
	      flag = 0;
	      d += String.fromCharCode(tmp | (c & 0x3f));
	    } else {
	      flag = 0;
	    }
	  }
	  return d;
}
function toPersian(engNum)
{
	var arr=engNum.toString();
	var result = "";
	for(var i=0;i<arr.length;i++)
	{
		var digit = arr.charAt(i);			
		digit = parseInt(digit);
		switch(digit)
		{
			case 0:
				result+= _from_utf8('۰');
				break;
			case 1:
				result+= _from_utf8('۱');
				break;
			case 2:
				result+= _from_utf8('۲');
				break;
			case 3:
				result+= _from_utf8('۳');
				break;
			case 4:
				result+= _from_utf8('۴');
				break;
			case 5:
				result+= _from_utf8('۵');
				break;
			case 6:
				result+= _from_utf8('۶');
				break;
			case 7:
				result+= _from_utf8('۷');
				break;
			case 8:
				result+= _from_utf8('۸');
				break;
			case 9:
				result+= _from_utf8('۹');
				break;
		}
	}	
	return result	
}

function GeorgianCalender() 
{
    this._init();
}
function addCalenderIconToPanel(context)
{
	PanelMenu.Button.prototype._init.call(context, 0.0);
	context._icon = new St.Icon({ icon_name: 'start-here',
                                          icon_type: St.IconType.SYMBOLIC,
                                          style_class: 'system-status-icon' });
	context.actor.set_child(context._icon);
    Main.panel._centerBox.add(context.actor, { y_fill: true });
}


function _showHello() 
{
	let text = new St.Label({ style_class: 'helloworld-label', text: "Hello, world!".toString() });
	let monitor = global.get_primary_monitor();	 
	global.stage.add_actor(text);
	text.set_position(Math.floor (monitor.width / 2 - text.width / 2),
		                      Math.floor(monitor.height / 2 - text.height / 2));
	Mainloop.timeout_add(300, function () { text.destroy(); });
	
}


function addDaysTable(context)
{
	
    //this.label = new St.Label({ text: "بهروز",style: 'color:rgb(255,0,0);margin-top:0px;' });
    let box = new St.BoxLayout({  vertical: true,
                                  width: 300,
                                  height: 280,
                                });
    let table = new St.Table({ style_class: 'table',
					              homogeneous: false,
					              reactive: true
					         });
    function L(text, color) 
    {
        /*return new St.Label({ text: text,
      	  					style_class: 'calendar-day'
                              });*/
    	let button = new St.Button({
										label: text,
										style_class: 'button' 
									 });
    	button.connect('clicked', Lang.bind(this, _showHello));
    	return button
    	
    }
    
    box.add(table, { expand: true });
    {
    	
  	  table.add(new St.Label({ text: _from_utf8("۱۳۹۰ تیر ۱").toString(),style_class: 'tableHeader'}),
			{ row: 0, col: 2 ,col_span:3});
  	 
  	  let icon_next_prop = { icon_name: 'go-next',
  			  			 icon_type: St.IconType.SYMBOLIC,
  			  			 icon_size: 32,
  			  			 style_class:'icon'}
  	  let nextIcon = new St.Icon(icon_next_prop); 
  	  table.add(nextIcon,
			{ row: 0, col: 6 });
  	  
  	  
	  let icon_back_prop = { icon_name: 'go-previous',
		  			 icon_type: St.IconType.SYMBOLIC,
		  			 icon_size: 32,
		  			 style_class: 'icon'}
	  let backIcon = new St.Icon(icon_back_prop); 
	  table.add(backIcon,
  			{ row: 0, col: 0 });
	  
	  backIcon.connect('button-release-event', Lang.bind(context, _showHello));
	  
    }
    
    function getWeekDay(input)
    {
    	switch(input)
    	{
    	case 0:
    		return _from_utf8("شنبه");
    	case 1:
    		return _from_utf8("۱شنبه");
    	case 2:
    		return _from_utf8("۲شنبه");
    	case 3:
    		return _from_utf8("۳شنبه");
    	case 4:
    		return _from_utf8("۴شنبه");
    	case 5:
    		return _from_utf8("۵شنبه");
    	case 6:
    		return _from_utf8("جمعه");
    	}
    }

    for(var i=0;i<7;i++)
    {
  	  table.add(new St.Label({ text: getWeekDay(i).toString(),style_class: 'weekday'}),
			{ row: 1, col: i });
    }
    
    var counter = 0;
    for(var i=2;i<7;i++)
  	  for(var j=0;j<7;j++)
    {
		  
  	  table.add(L(toPersian(counter).toString(), "rgb("+counter*5.8+","+counter*5.8+","+counter*5.8+")"),
			{ row: i, col: j });
  	  counter++;
    }
    return box;
}

GeorgianCalender.prototype = 
{
    __proto__: PanelMenu.Button.prototype,
    _init: function() 
    {
    	//Initialize Calender Icon!!
    	addCalenderIconToPanel(this);
    	//Initialize Header
    	//this.menu.addActor(addHeaderBox());
    	//Initialize Days Table
    	this.menu.addActor(addDaysTable(this));
    	this.menu.addMenuItem(new PopupMenu.PopupSeparatorMenuItem());
    	this.menu.addActor(new St.Label({ text: _from_utf8("توسعه دهنده : بهروز شفیعی").toString(),style_class: 'tableHeader'}))
    	//Connect menu to Gnome-Panel
        Main.panel._centerBox.add(this.actor, { y_fill: true });
        Main.panel._menus.addMenu(this.menu);
        
    }

};

function main(extensionMeta) 
{
    new GeorgianCalender();   
}






