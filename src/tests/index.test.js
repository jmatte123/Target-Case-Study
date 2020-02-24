require("jest");
const fetch = require("node-fetch");

// this tests a get request with an actual product prvided by the api
test("GET request with an actual product (return name, value and currency_code)", async () => {
    const res = await fetch("http://localhost:4000/products/13860428")
    .then((res) => {
        return res.json();
    }).catch((err) => {
        return err
    });
    
    expect(res).toEqual({
        "id": "13860428",
        "name": "The Big Lebowski (Blu-ray)",
        "current_price": {
            "value": 12.49,
            "currency_code": "USD"
        }
    });
});

// this tests a get request where there is no product information provided by the api
test("GET request with no product (return name, value and currency_code)", async () => {
    const res = await fetch("http://localhost:4000/products/16696652")
    .then((res) => {
        return res.json();
    }).catch((err) => {
        return err
    });

    expect(res).toEqual({
        "product": {
            "item": {}
        }
    });
});

// this tests a put request based on the product of the first test
test("PUT request with a product (return updated_value and updated_currency_code)", async () => {
    var res = await fetch("http://localhost:4000/products/13860428", {
        method: 'PUT',
        headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
        },
        body: JSON.stringify({ value: 50.11 })
    }).then((res) => {
        return res.json();
    }).catch((err) => {
        return err
    });

    expect(res).toEqual({
        "success": true,
        "updated_price": 50.11,
        "updated_currency_code": "USD"
    });

    // change it back
    res = await fetch("http://localhost:4000/products/13860428", {
        method: 'PUT',
        headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
        },
        body: JSON.stringify({ value: 12.49 })
    }).then((res) => {
        return res.json();
    }).catch((err) => {
        return err
    });
});