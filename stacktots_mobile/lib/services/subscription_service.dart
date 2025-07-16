import 'package:http/http.dart' as http;
import 'dart:convert';
import 'package:shared_preferences/shared_preferences.dart';

class SubscriptionService {
  final String _apiUrl = 'http://localhost:3000/api/subscriptions';

  Future<List<dynamic>> getPlans() async {
    final prefs = await SharedPreferences.getInstance();
    final token = prefs.getString('token');

    final response = await http.get(
      Uri.parse('$_apiUrl/plans'),
      headers: <String, String>{
        'Content-Type': 'application/json; charset=UTF-8',
        'Authorization': 'Bearer $token',
      },
    );

    if (response.statusCode == 200) {
      return jsonDecode(response.body);
    } else {
      throw Exception('Failed to load plans');
    }
  }

  Future<void> createSubscription(int planId, String paymentMethodId) async {
    final prefs = await SharedPreferences.getInstance();
    final token = prefs.getString('token');

    final response = await http.post(
      Uri.parse('$_apiUrl/create'),
      headers: <String, String>{
        'Content-Type': 'application/json; charset=UTF-8',
        'Authorization': 'Bearer $token',
      },
      body: jsonEncode(<String, dynamic>{
        'planId': planId,
        'paymentMethodId': paymentMethodId,
      }),
    );

    if (response.statusCode != 200) {
      throw Exception('Failed to create subscription');
    }
  }
}
