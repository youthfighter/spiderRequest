module.exports = {
  url: 'https://xyk.cebbank.com/mallwap/index',
  encode: 'utf8',
  content: {
    'name':'data',
    'selector': '.my-content',
    'value':[
      {
        'name':'bannerInfo',
        'selector':'.js-swiper-container .swiper-slide a',
        'value':[
          {
            'name':'href',
            'value':['attr','onclick']
          },
          {
            'name':'src',
            'selector':'img',
            'value':['attr','src']
          }
        ]
      },
      {
        'name':'floorsInfo',
        'selector':'.goods_show_style_1 .goods_show_main ',
        'value':[
          {
            'name':'floorName',
            'selector':'.goods_type',
            'value':['text']
          },
          {
            'name':'floorLink',
            'selector':'.goods_type a',
            'value':['attr',"onclick"]
          },
          {
            'name':'floorImage',
            'selector':'.goods-pic-style-1 img',
            'value':['data',"original"]
          },
          {
            'name':'floorImageLink',
            'selector':'.goods-pic-style-1',
            'value':['attr',"onclick"]
          },
          {
            'name':'goods2',
            'selector':'.grid-row-2',
            'value':[
              {
                'name':'goodsImage',
                'selector':'li img',
                'eq':0,
                'value':['data','original']
              },{
                'name':'goodsName',
                'selector':'li',
                'eq':1,
                'value':['text'],
                'trim':'all'
              },{
                'name':'goodsLink',
                'selector':'.goods-pic-style-2',
                'value':['attr','onclick']
              },{
                'name':'goodsPrice',
                'selector':'li',
                'eq':3,
                'value':['text'],
                'trim':'all'
              }
            ]
          },
          {
            'name':'goods4',
            'selector':'.grid-row-4',
            'value':[
              {
                'name':'goodsImage',
                'selector':'li img',
                'eq':0,
                'value':['data','original']
              },{
                'name':'goodsName',
                'selector':'li',
                'eq':1,
                'value':['text'],
                'trim':'all'
              },{
                'name':'goodsLink',
                'selector':'.goods-pic-style-3',
                'value':['attr','onclick']
              },{
                'name':'goodsPrice',
                'selector':'li',
                'eq':3,
                'value':['text'],
                'trim':'all'
              },
              {
                'name':'goodsInstalments',
                'selector':'.instalments',
                'value':['text'],
                'trim':'all'
              },
            ]
          }
        ]
      }
    ]
  }
};