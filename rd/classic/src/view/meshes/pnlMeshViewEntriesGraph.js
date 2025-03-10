Ext.define('Rd.view.meshes.pnlMeshViewEntriesGraph', {
    extend  : 'Ext.panel.Panel',
    alias   : 'widget.pnlMeshViewEntriesGraph',
    border  : false,
    layout: {
        type    : 'vbox',
        align   : 'stretch'
    },
    bodyStyle: {backgroundColor : 'pink' },
    hide_owner  : false,
    requires: [
        'Rd.view.meshes.pnlMeshViewDeviceDetail',
        'Rd.view.dataUsage.pnlDataUsageGraph'
    ],
    height  : 550,
    hidePlrNodes : true,
    initComponent: function(){
    
        var me      = this; 
        var m       = 5;
        var p       = 5;   
        var s       = Ext.create('Ext.data.Store', {
            fields  :[ 
                {name: 'id',            type: 'int'},
                {name: 'name',          type: 'string'},
                {name: 'alias',         type: 'string'},
                {name: 'mac',           type: 'string'},
                {name: 'vendor',        type: 'string'},
                {name: 'data_in',       type: 'int'},
                {name: 'data_out',      type: 'int'},
                {name: 'data_total',    type: 'int'}
            ]
        });
        
        var s_nodes   = Ext.create('Ext.data.Store', {
            fields  :[ 
                {name: 'id',            type: 'int'},
                {name: 'name',          type: 'string'},
                {name: 'data_in',       type: 'int'},
                {name: 'data_out',      type: 'int'},
                {name: 'data_total',    type: 'int'}
            ]
        });
        
        var bottom_items = [
            {
                xtype   : 'pnlDataUsageGraph',
                flex    : 2,
                margin  : m,
                padding : p,
                layout  : 'fit',
                border  : false
                
            }
        ];
                 
        me.items = [
            {
                xtype   : 'panel',
                flex    : 1,
                border  : false,
                layout: {
                    type    : 'hbox',
                    align   : 'stretch'
                },
                items : [
                    {
                        xtype   : 'panel',
                        margin  : m,
                        padding : p,
                        flex    : 1,
                        bodyCls : 'pnlInfo',
                        layout  : 'fit',
                        border  : true,
                        ui      : 'light',
                        itemId  : 'total',
                        tpl     : new Ext.XTemplate(
                            '<div class="divInfo">', 
                                '<div>',
                                    '<tpl if="graph_item==\'ssid\'">',
                                        '<span><i class="fa fa-wifi"></i>  {ssid}</span>',
                                    '</tpl>',
                                    '<tpl if="graph_item==\'device\'">',
                                        '<span><i class="fa fa-laptop"></i>  {mac}</span>',
                                    '</tpl>',
                                    '<tpl if="graph_item==\'node\'">',
                                        '<span><i class="fa fa-cube"></i>  {node}</span>',
                                    '</tpl>',   
                                '</div>',  
                                '<h1 style="font-size:270%;font-weight:lighter;">{data_total}</h1>',       
                                '<p style="color: #000000; font-size:140%;">',
                                    '<span class="grpUp"><i class="fa fa-arrow-circle-down"></i></span> In: {data_in}',
                                    '&nbsp;&nbsp;&nbsp;&nbsp;',
                                    '<span class="grpDown"><i class="fa fa-arrow-circle-up"></i></span> Out: {data_out}',
                                '</p>',
                            '</div>'
                        ),
                        data    : {
                        }
                    },
                    {
                        xtype           : 'pnlMeshViewDeviceDetail',
                        margin          : m,
                        padding         : p,
                        hidden          : true,
                        flex            : 1,
                        itemId          : 'pnlMeshViewUser'  
                    },
                    {
                        flex            : 1,
                        margin          : m,
                        padding         : p,
                        border          : false,
                        itemId          : 'plrTopTen',
                        xtype           : 'polar',
                        innerPadding    : 10,
                        interactions    : ['rotate', 'itemhighlight'],
                        store           : s,
                        series: {
                           type         : 'pie',                       
                           highlight    : true,
                           angleField   : 'data_total',
                           label        : {
                               field    : 'name',
                               display  : 'rotate'
                           },
                           donut        : 10,    
                           tooltip : {
                                trackMouse: true,
                                renderer: function (tooltip, record, item) {
                                    tooltip.setHtml(
                                        "<h2>"+record.get('mac')+"</h2><h3>"+Ext.ux.bytesToHuman(record.get('data_total'))+"</h3>"                           
                                    );
                                }
                            }    
                        }
                    },
                    {
                        xtype   : 'grid',
                        margin  : m,
                        padding : p,
                        ui      : 'light',
                        title   : 'Top 10 Devices',
                        glyph   : Rd.config.icnUser,
                        itemId  : 'gridTopTen',
                        border  : true,       
                        store   : s,
                        emptyText: 'No Devices',
						multiSelect	: true,
                        tools   : [
                            {
                                tooltip : 'Create Alias',
                                itemId  : 'toolAlias',
                                glyph   : Rd.config.icnEdit
                            },
                            {
                                tooltip : 'Advance Firewall',
                                itemId  : 'toolFirewall',
                                glyph   : Rd.config.icnFire
                            },
                            {
                                tooltip : 'Limit Speed',
                                itemId  : 'toolLimit',
                                glyph   : Rd.config.icnSpeed
                            },
                            {
                                tooltip : 'Block Device',
                                itemId  : 'toolBlock',
                                glyph   : Rd.config.icnBan
                            }
                        ],
                        columns: [
                            { 
                            	text		: 'Alias / MAC Address',
                            	dataIndex	: 'name',
                            	flex		: 1,
                            	hidden		: false,
                            	xtype       : 'templatecolumn',
								tpl         : new Ext.XTemplate(
								    '<tpl if="cloud_flag & block_flag">',
								    	'<tpl if="alias">{alias}<tpl else>{mac}</tpl>',
								        '<br><span style="font-size:75%;color:#cc6600;"><i class="fa fa-cloud"></i>  <i class="fa fa-ban"></i></span>',
								    '<tpl elseif="cloud_flag & limit_flag">',
								    	'<tpl if="alias">{alias}<tpl else>{mac}</tpl>',
								    	'<br><span style="font-size:75%;color:#cc6600;"><i class="fa fa-cloud"></i>  <span style="font-family:FontAwesome;">&#xf0e4;</span> (<i class="fa fa-arrow-circle-down"></i> {bw_down} / <i class="fa fa-arrow-circle-up"></i> {bw_up} )</span>',
								    '<tpl elseif="block_flag">',
								    	'<tpl if="alias">{alias}<tpl else>{mac}</tpl>',
								        '<br><span style="font-size:75%;color:#cc6600;"><i class="fa fa-ban"></i></span>',
								    '<tpl elseif="limit_flag">',
								    	'<tpl if="alias">{alias}<tpl else>{mac}</tpl>',
								        '<br><span style="font-size:75%;color:#cc6600;"><span style="font-family:FontAwesome;">&#xf0e4;</span> (<i class="fa fa-arrow-circle-down"></i> {bw_down} / <i class="fa fa-arrow-circle-up"></i> {bw_up} )</span>',
								    '<tpl else>',
								        '<tpl if="alias">{alias}<tpl else>{mac}</tpl>',
								    '</tpl>'
								)   
                            },                          
                            { text: 'Vendor',               dataIndex: 'vendor', flex: 1,  hidden: true},
                            { text: 'MAC',                  dataIndex: 'mac',    flex: 1,  hidden: true},
                            { text: 'Data In',   dataIndex: 'data_in',  hidden: true, renderer: function(value){
                                    return Ext.ux.bytesToHuman(value)              
                                } 
                            },
                            { text: 'Data Out',  dataIndex: 'data_out', hidden: true,renderer: function(value){
                                    return Ext.ux.bytesToHuman(value)              
                                } 
                            },
                            { text: 'Data Total',dataIndex: 'data_total',tdCls: 'gridMain',renderer: function(value){
                                    return Ext.ux.bytesToHuman(value)              
                                } 
                            }
                        ],
                        flex: 1
                    }
                ]
            },
            {
                xtype   : 'panel',
                flex    : 1,
                border  : false,
                layout: {
                    type    : 'hbox',
                    align   : 'stretch'
                },
                items   : [
                    {
                        xtype   : 'pnlDataUsageGraph',
                        flex    : 2,
                        margin  : m,
                        padding : p,
                        layout  : 'fit',
                        border  : false
                        
                    },
                    {
                        flex            : 1,
                        margin          : m,
                        padding         : p,
                        border          : false,
                        itemId          : 'plrNodes',
                        xtype           : 'polar',
                        innerPadding    : 10,
                        hidden          : me.hidePlrNodes,
                        interactions    : ['rotate', 'itemhighlight'],
                        store           : s_nodes,
                        series: {
                           type         : 'pie',                       
                           highlight    : true,
                           angleField   : 'data_total',
                           label        : {
                               field    : 'name',
                               display  : 'rotate'
                           },
                           donut        : 10,    
                           tooltip : {
                                trackMouse: true,
                                renderer: function (tooltip, record, item) {
                                    tooltip.setHtml(
                                        "<h2>"+record.get('name')+"</h2><h3>"+Ext.ux.bytesToHuman(record.get('data_total'))+"</h3>"                           
                                    );
                                }
                            }    
                        }
                    }
                ]
            }
        ];       
        
        me.callParent(arguments);
    }
});
