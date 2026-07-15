const paypalClient = require("./paypalClient");
const checkoutNodeJssdk = require("@paypal/checkout-server-sdk");

exports.createOrder = async (req, res) => {
    try {
        const { amount } = req.body;

        const request = new checkoutNodeJssdk.orders.OrdersCreateRequest();

        request.prefer("return=representation");

        request.requestBody({
            intent: "CAPTURE",
            purchase_units: [
                {
                    amount: {
                        currency_code: "USD",
                        value: amount,
                    },
                },
            ],
        });

        const order = await paypalClient.execute(request);

        res.json({
            id: order.result.id,
        });

    } catch (error) {

        console.log(error);

        res.status(500).json(error);
    }
};

exports.captureOrder = async (req, res) => {

    try {

        const request =
            new checkoutNodeJssdk.orders.OrdersCaptureRequest(
                req.params.orderID
            );

        request.requestBody({});

        const capture = await paypalClient.execute(request);

        res.json(capture.result);

    } catch (error) {

        console.log(error);

        res.status(500).json(error);

    }

};