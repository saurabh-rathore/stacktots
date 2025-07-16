import 'package:flutter/material.dart';
import 'package:flutter_stripe/flutter_stripe.dart';
import 'package:stacktots_mobile/services/subscription_service.dart';

class SubscriptionScreen extends StatefulWidget {
  const SubscriptionScreen({Key? key}) : super(key: key);

  @override
  _SubscriptionScreenState createState() => _SubscriptionScreenState();
}

class _SubscriptionScreenState extends State<SubscriptionScreen> {
  final SubscriptionService _subscriptionService = SubscriptionService();
  late Future<List<dynamic>> _plans;
  dynamic _selectedPlan;

  @override
  void initState() {
    super.initState();
    _plans = _subscriptionService.getPlans();
    Stripe.publishableKey = 'pk_test_YOUR_STRIPE_PUBLIC_KEY';
  }

  Future<void> _subscribe() async {
    if (_selectedPlan == null) {
      return;
    }

    try {
      final paymentMethod = await Stripe.instance.createPaymentMethod(const PaymentMethodParams.card());
      await _subscriptionService.createSubscription(_selectedPlan['id'], paymentMethod.id);
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Subscription successful')),
      );
    } catch (e) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text(e.toString())),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Subscription'),
      ),
      body: Column(
        children: <Widget>[
          Expanded(
            child: FutureBuilder<List<dynamic>>(
              future: _plans,
              builder: (context, snapshot) {
                if (snapshot.hasData) {
                  final plans = snapshot.data!;
                  return ListView.builder(
                    itemCount: plans.length,
                    itemBuilder: (context, index) {
                      final plan = plans[index];
                      return RadioListTile<dynamic>(
                        title: Text(plan['name']),
                        subtitle: Text('${plan['price']} / ${plan['duration']}'),
                        value: plan,
                        groupValue: _selectedPlan,
                        onChanged: (value) {
                          setState(() {
                            _selectedPlan = value;
                          });
                        },
                      );
                    },
                  );
                } else if (snapshot.hasError) {
                  return Center(
                    child: Text('${snapshot.error}'),
                  );
                }
                return const Center(
                  child: CircularProgressIndicator(),
                );
              },
            ),
          ),
          if (_selectedPlan != null)
            Padding(
              padding: const EdgeInsets.all(8.0),
              child: Column(
                children: [
                  CardField(
                    onCardChanged: (card) {},
                  ),
                  ElevatedButton(
                    onPressed: _subscribe,
                    child: const Text('Subscribe'),
                  ),
                ],
              ),
            ),
        ],
      ),
    );
  }
}
