const PLUS = '+';
const PRICE = 9.99;
const LOAD_NUM = 10;
new Vue({
  el: '#app',
  data: {
    total: 0,
    items: [],
    cart: [],
    results: [],
    newSearch: 'anime',
    lastSearch: '',
    loading: false,
    price: PRICE
  },
  computed: {
    noMoreItems() {
      return this.items.length === this.results.length && this.results.length > 0;
    }
  },
    methods: {
      appendItems() {
        if (this.items.length < this.results.length) {
          this.items = this.results.slice(0,this.items.length+LOAD_NUM);
        };
      },
      onSubmit() {
        if (this.newSearch.length) {
          this.items=[];
          this.loading = true;
          this.$http
          .get('/search/'.concat(this.newSearch))
          .then( function(res) {
            this.lastSearch = this.newSearch;
            this.results = res.data;
            this.appendItems();
            // this.items = this.results.slice(0,LOAD_NUM);
            this.loading = false;
          });
        }
      },
      addItem(index) {
        this.total+=this.price;
        var item = this.items[index];
        var found = false;
        for (var i=0; i<this.cart.length; i++) {
          if (this.cart[i].id === item.id) {
            this.cart[i].qty++;
            found = true;
            break;
          }
        }
        if (!found) {
          this.cart.push({
            id: item.id, title: item.title, qty: 1, price: this.price
          });
        }
      },
      adjustCartItem(index,adjustType) {
        var cartItem = this.cart[index];
        if (adjustType == PLUS) {
          // Increment
          cartItem.qty++;
          this.total+=cartItem.price;
        }
        else {
          // Decrement
          cartItem.qty--;
          this.total-=cartItem.price;
          // Remove item if quantity back to zero
          if (cartItem.qty <= 0) {
            for (var i=0; i<this.cart.length; i++) {
              if (this.cart[i].id === cartItem.id) {
                this.cart.splice(i,1);
                break;
              }
            }
          }
        }
      }
    },
  filters: {
    currency(valueIn) {
      return '$'.concat(valueIn.toFixed(2));
    },
    capitalize(valueIn) {
      return valueIn.toUpperCase();
    }
  },
  mounted: function() {
    this.onSubmit();

    var vueInstance = this;
    var elem = document.getElementById('product-list-bottom');
    var watcher = scrollMonitor.create(elem);
    watcher.enterViewport( function() {
      vueInstance.appendItems();
      console.log('Base entered viewport');
    });
  }
});
