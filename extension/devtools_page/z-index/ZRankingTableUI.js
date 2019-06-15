// eslint-disable-next-line no-unused-vars
class ZRankingTableUI {
  constructor () {
    this._onClickListener = (event) => {
      const elSelector = event.target.closest('[data-selector]');
      if (elSelector) {
        const selector = {
          'selector': elSelector.getAttribute('data-selector'),
          'zIndexGuid': elSelector.getAttribute('uuid-element')
        };
        if (typeof this.onSelect === 'function') {
          this.onSelect(selector);
        }
      }
    };
  }

  start ({ elTable }) {
    this.elTable = elTable;
    this.elTable.addEventListener('click', this._onClickListener);
  }

  stop () {
    this.elTable.removeEventListener('click', this._onClickListener);
    this.elTable = null;
  }

  async updateTable ({ ranking = [] }) {
    const html = ranking
    .map((row,i) => this._buildTableRowHtml(row,i))
    .join('');
    this.elTable.innerHTML = html;
  }

  _buildTableRowHtml (row,i) {
    const selector = [
    row.tagName,
    row.id ? `#${row.id}` : '',
    row.classNames.length > 0 ? `.${row.classNames.join('.')}` : '',
    ].join('');

    const selectorHtml = [
    this._buildElementTitleHtml(row.tagName, 'tagName'),
    this._buildElementTitleHtml(row.id, 'id', '#'),
    this._buildElementTitleHtml(row.classNames.join('.'), 'classes', '.'),
    ].join('');

    const html = `
    <tr>
    <td class="rankingTableItem-num">${i+1}</td>
    <td class="rankingTableItem-zIndex">${row.zIndex}</td>
    <td class="rankingTableItem-element">
    <span class="rankingTableItem-selector" uuid-element="${row.zIndexGuid}" title="${row.zIndexGuid}"
    data-selector="${selector}">${selectorHtml}</span>
    </td>
    <td class="rankingTableItem-parent">
    <span class="rankingTableItem-selector" uuid-element="${row.zCont.parentStackingContextGUID}" title="${row.zCont.parentStackingContextGUID}"
    data-selector="${row.zCont.parentStackingContext}">${row.zCont.parentStackingContext}</span>
    </td>
    <td class="rankingTableItem-zIndex">${row.zCont.parentZIndex}</td>
    <td class="rankingTableItem-relevant">
    <span class="rankingTableItem-relevant">${row.zCont.relevant}</span>
    </td>
    </tr>
    `;
    return html;
  }

  _buildElementTitleHtml (text, type, prefix = '') {
    if (text) {
      return `<span class="rankingTableItem-${type}">${prefix}${text}</span>`;
    }
    return '';
  }
}

ZRankingTableUI.buildRanking = (d = document) => {
  const ranking = Array.from(d.querySelectorAll('*'))
  .map((el, arr) => {
    if (!el.zIndexGuid){
      el.zIndexGuid = guid();
    }
    return {
      classNames: Array.from(el.classList),
      id: el.id,
      zIndexGuid: el.zIndexGuid,
      tagName: el.tagName.toLowerCase(),
      zIndex: Number(getComputedStyle(el).zIndex),
      zCont: zContext(el)
    }
  })
  .filter(({ zIndex }) => !Number.isNaN(zIndex))
  .sort((r1, r2) => (r1.zCont.relevant - r2.zCont.relevant) || (r2.zIndex - r1.zIndex) ||(r2.zCont.parentStackingContextGUID.substr(0,1).charCodeAt() - r1.zCont.parentStackingContextGUID.substr(0,1).charCodeAt()));
  return ranking;

  function guid() {
    function s4() {
      return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
    }
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
  }


  function zContext(el) {
    var props = {},
    //Also see: https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Positioning/Understanding_z_index/The_stacking_context
    getClosestStackingContext = function( nodeOrObject ) {
      var node = nodeOrObject.node || nodeOrObject;

      //the root element (HTML)
      if( ! node || node.nodeName === 'HTML' || node.nodeName === '#document-fragment' ) {
        return { node: document.documentElement, reason: 'root' };
      }

      var computedStyle = getComputedStyle( node );

      // position: fixed
      if ( computedStyle.position === 'fixed' ) {
        return { node: node, reason: 'position: fixed' };
      }

      // positioned (absolutely or relatively) with a z-index value other than "auto",
      if ( computedStyle.zIndex !== 'auto' && computedStyle.position !== 'static' ) {
        return { node: node, reason: 'position: ' + computedStyle.position + '; z-index: ' + computedStyle.zIndex };
      }

      // elements with an opacity value less than 1.
      if ( computedStyle.opacity !== '1' ) {
        return { node: node, reason: 'opacity: ' + computedStyle.opacity };
      }

      // elements with a transform value other than "none"
      if ( computedStyle.transform !== 'none' ) {
        return { node: node, reason: 'transform: ' + computedStyle.transform };
      }

      // elements with a mix-blend-mode value other than "normal"
      if ( computedStyle.mixBlendMode !== 'normal' ) {
        return { node: node, reason: 'mixBlendMode: ' + computedStyle.mixBlendMode };
      }

      // elements with a filter value other than "none"
      if ( computedStyle.filter !== 'none' ) {
        return { node: node, reason: 'filter: ' + computedStyle.filter };
      }

      // elements with a perspective value other than "none"
      if ( computedStyle.perspective !== 'none' ) {
        return { node: node, reason: 'perspective: ' + computedStyle.perspective };
      }

      // elements with isolation set to "isolate"
      if ( computedStyle.isolation === 'isolate' ) {
        return { node: node, reason: 'isolation: ' + computedStyle.isolation };
      }

      // transform or opacity in will-change even if you don't specify values for these attributes directly
      if( computedStyle.willChange === 'transform' || computedStyle.willChange === 'opacity' ) {
        return { node: node, reason: 'willChange: ' + computedStyle.willChange };
      }

      // elements with -webkit-overflow-scrolling set to "touch"
      if ( computedStyle.webkitOverflowScrolling === 'touch' ) {
        return { node: node, reason: '-webkit-overflow-scrolling: touch' };
      }

      // a flex item with a z-index value other than "auto", that is the parent element display: flex|inline-flex,
      if ( computedStyle.zIndex !== 'auto' ) {
        var parentStyle = getComputedStyle( node.parentNode );
        if ( parentStyle.display === 'flex' || parentStyle.display === 'inline-flex' ) {
          return {
            node: node,
            reason: 'flex-item; z-index: ' + computedStyle.zIndex
          };
        }
      }

      return getClosestStackingContext( { node: node.parentNode, reason: 'not a stacking context' } );

    },
    shallowCopy = function( data ) {
      var props = Object.getOwnPropertyNames( data );
      var copy = { __proto__: null };
      for( var i = 0; i < props.length; ++i ) {
        copy[ props[ i ] ] = data[ props[ i ] ];
      }
      return copy;
    },
    generateSelector = function( element ) {
      var selector, tag = element.nodeName.toLowerCase();
      if( element.id ) {
        selector = '#' + element.getAttribute( 'id' );
      } else if( element.getAttribute( 'class' ) ) {
        selector = '.' + element.getAttribute( 'class' ).split( ' ' ).join( '.' );
      }
      return selector ? tag + selector : tag;
    },
    getRelevant = function(element, relevant){
      var buffPC = getClosestStackingContext(element).node;


      if(buffPC ===element){
        if ( element.nodeName !== 'HTML' ) {
          buffPC = getClosestStackingContext( element.parentNode ).node;
        }
      }

      if (buffPC.nodeName !== 'HTML'){
        relevant += 1;
        relevant = getRelevant(buffPC, relevant);
      }
      return relevant;

    };
    if( el && el.nodeType === 1 ) {
      var closest = getClosestStackingContext( el );
      var createsStackingContext = el === closest.node;
      var reason = createsStackingContext ? closest.reason : 'not a stacking context';
      var parentContext = closest.node;
      var computedStyle = getComputedStyle( el );
      var relevant = 0;
      if ( createsStackingContext && el.nodeName !== 'HTML' ) {
        parentContext = getClosestStackingContext( el.parentNode ).node;
      }

      var parentComputedStyle = getComputedStyle( parentContext );

      relevant = getRelevant(el, relevant);

      props = {
        current: generateSelector( el ),
        createsStackingContext: createsStackingContext,
        createsStackingContextReason: reason,
        parentStackingContext: generateSelector( parentContext ),
        parentStackingContextGUID: parentContext.zIndexGuid,
        parentZIndex: parentComputedStyle.zIndex !== 'auto' ? parseInt( parentComputedStyle.zIndex, 10 ) : parentComputedStyle.zIndex,
        'z-index': computedStyle.zIndex !== 'auto' ? parseInt( computedStyle.zIndex, 10 ) : computedStyle.zIndex,
        relevant: relevant
      };
    }
    return shallowCopy( props );
  }


};
