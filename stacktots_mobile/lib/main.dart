import 'package:flutter/material.dart';
import 'package:stacktots_mobile/screens/dashboard_screen.dart';
import 'package:stacktots_mobile/screens/home_screen.dart';
import 'package:stacktots_mobile/screens/login_screen.dart';
import 'package:stacktots_mobile/screens/register_screen.dart';

void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'StackTots',
      theme: ThemeData(
        primarySwatch: Colors.blue,
      ),
      initialRoute: '/',
      routes: {
        '/': (context) => const HomeScreen(),
        '/login': (context) => const LoginScreen(),
        '/register': (context) => const RegisterScreen(),
        '/dashboard': (context) => const DashboardScreen(),
      },
    );
  }
}
