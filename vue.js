const baseUri = 'https://mevncw2.herokuapp.com';

const services = {
    getLessons: (cb) => {
        const options = {
            method: 'GET',
            headers: new Headers(),
            mode: 'cors',
            cache: 'default'
        };
        
        fetch(`${baseUri}/api/lessons`, options)
            .then((response) => response.json())
            .then((data) => cb(data));
    },

    postOrder: (payload, cb) => {
        const options = {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        };

        fetch(`${baseUri}/api/orders`, options)
            .then((data) => cb(data));
    },

    putLesson: (payload, cb) => {
        const options = {
            method: 'PUT',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        };

        fetch(`${baseUri}/api/lessons/${payload.id}`, options)
            .then((data) => cb(data));
    },

    removeOrder: (payload, cb) => {
        const options = {
            method: 'DELETE',
            headers: new Headers(),
            mode: 'cors',
            cache: 'default',
        };

        fetch(`${baseUri}/api/orders/${payload.id}`, options)
            .then((data) => cb(data));
    }
}

var webstore = new Vue({
    el: "#app",
    data: {
        vueimage: '100x100',
        showProduct: true,
        checkouted: false,
        loading: false,
        checkouting: false,
        products: [],
        errors: [],
        order: {},
        sitename: "Classes & Activities",
        carts: []
    },
    mounted() {
        this.resetOrder();
        this.loadProducts();
    },
    methods: {
        resetOrder() {
            this.carts = [];
            this.order.firstName = null;
            this.order.phoneNumber = null;
        },

        loadProducts() {
            this.loading = true;
            services.getLessons((data) => {
                this.products = data;
                this.loading = false;
            });
        },

        addToCart(product) {
            const existsProduct = this.carts.find(item => item.title === product.title);

            if (!existsProduct) {
                this.carts.push({ title: product.title, count: 0, id: product.id });
            }

            this.carts.forEach((item) => {
                if (item.id === product.id) {
                    item.count++;
                    product.availableInventory--;
                }
            });
        },

        showCheckout() {
            this.showProduct = !this.showProduct;

            if (!!this.showProduct) {
                this.resetOrder();
                this.loadProducts();
            }
        },

        submitForm(e) {
            e.preventDefault();

            this.checkForm();

            if (this.errors.length > 0) 
                return;

            const payload = {
                customer: {
                    firstName: this.order.firstName,
                    phoneNumber: this.order.phoneNumber,
                },
                lessons: [
                    ...this.carts
                ]
            };

            this.checkouting = true;

            services.postOrder(payload, () => {
                this.carts.forEach((cart) => {
                    const payloadLesson = {
                        id: cart.id,
                        total: cart.count
                    };

                    services.putLesson(payloadLesson, () => {
                        this.checkouted = true;
                        this.checkouting = false;
                    });
                });
            });
        },

        canAddToCart(product) {
            return product.availableInventory > this.cartCount(product.id)
        },

        cartCount(id) {
            const count = this.carts.filter(item => item.id === id).length;
            return count;
        },

        checkForm() {
            this.errors = [];

            if (this.order.firstName && this.order.phoneNumber) 
                return;

            if (!this.order.firstName) {
                this.errors.push('Please enter your first name.');
            }
            if (!this.order.phoneNumber) {
                this.errors.push('Please enter your phone number name');
            }
        },

        removeOrder(order) {
            services.removeOrder(order, (data) => {
                console.log(data);
            });
        }
    }
});