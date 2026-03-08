const run = async () => {
    const response = await fetch('https://api.stripe.com/v1/payment_intents', {
        method: 'POST',
        headers: {
            'Authorization': 'Bearer sk_test_51RvGIWK8ke7t62uBxJGruVUuCkXT4KkrvPhZwNtyY6X7MKIPVtRvqnQRIHUE61suCAHJWCuZNv5wHm3vMagm3Lr900G5710mFv',
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: new URLSearchParams({
            'amount': '4045',
            'currency': 'zar',
            'automatic_payment_methods[enabled]': 'true'
        })
    });
    const data = await response.json();
    console.log(JSON.stringify(data, null, 2));
};
run();
