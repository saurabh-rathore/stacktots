import 'package:http/http.dart' as http;
import 'package:shared_preferences/shared_preferences.dart';

class TtsService {
  final String _apiUrl = 'http://localhost:3000/api/tts';

  Future<String> getAudioUrl(int id) async {
    final prefs = await SharedPreferences.getInstance();
    final token = prefs.getString('token');

    final response = await http.get(
      Uri.parse('$_apiUrl/$id'),
      headers: <String, String>{
        'Authorization': 'Bearer $token',
      },
    );

    if (response.statusCode == 200) {
      // In a real app, you would save the file and return the local path
      // For simplicity, we'll just return the URL
      return '$_apiUrl/$id';
    } else {
      throw Exception('Failed to load audio');
    }
  }
}
