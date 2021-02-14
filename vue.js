var webstore = new Vue({
    el: "#app",
    data: {
        showProduct: true,
        products: [],
        errors: [],
        order: {
            firstName: null,
            phoneNumber: null,
        },
        sitename: "Classes & Activities",
        carts: []
    },
    mounted() {
        const options = {
            method: 'GET',
            headers: new Headers(),
            mode: 'cors',
            cache: 'default'
        };

        fetch("http://localhost:3000/api/products", options)
            .then((response) => response.json())
            .then((data) => {
                this.products = data;
                this.loading = false;
            });
    },
    methods: {
        decrement(product) {
            if (product.availableInventory > 0) {
                product.availableInventory--;
            }
        },
        addToCart(product) {
            const existsProduct = this.carts.find(item => item.title === product.title);

            if (!existsProduct) {
                this.carts.push({ title: product.title, count: 1 });
                return;
            } 

            this.carts.forEach((item) => {
                if (item.title === product.title) {
                    item.count++;
                }
            });
        },
        showCheckout() {
            this.showProduct = !this.showProduct;
        },
        submitForm() {
        },
        canAddToCart(product) {
            return product.availableInventory > this.cartCount(product.id)
        },
        cartCount(id) {
            const count = this.carts.filter(item => item.id === id).length;
            // for (let i = 0; i < this.cart.length; i++) {
            //     if (this.cart[i] === id) count++;
            // }
            return count;
        },
        checkForm(e) {
            if (this.order.firstName && this.order.phoneNumber) return;

            this.errors = [];

            if (!this.order.firstName) {
                this.errors.push('Please enter your first name.');
            }
            if (!this.order.phoneNumber) {
                this.errors.push('Please enter your phone number name');
            }

            e.preventDefault();
        },
    }
});