import 'package:flutter/material.dart';
import 'package:stacktots_mobile/services/content_service.dart';
import 'package:stacktots_mobile/services/tts_service.dart';
import 'package:audioplayers/audioplayers.dart';

class DashboardScreen extends StatefulWidget {
  const DashboardScreen({Key? key}) : super(key: key);

  @override
  _DashboardScreenState createState() => _DashboardScreenState();
}

class _DashboardScreenState extends State<DashboardScreen> {
  final ContentService _contentService = ContentService();
  final TtsService _ttsService = TtsService();
  final AudioPlayer _audioPlayer = AudioPlayer();
  late Future<List<dynamic>> _content;

  @override
  void initState() {
    super.initState();
    _content = _contentService.getContent();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Dashboard'),
      ),
      body: FutureBuilder<List<dynamic>>(
        future: _content,
        builder: (context, snapshot) {
          if (snapshot.hasData) {
            final content = snapshot.data!;
            final stories = content.where((item) => item['type'] == 'story').toList();
            final games = content.where((item) => item['type'] == 'game').toList();
            final videos = content.where((item) => item['type'] == 'video').toList();
            final quizzes = content.where((item) => item['type'] == 'quiz').toList();
            final puzzles = content.where((item) => item['type'] == 'puzzle').toList();
            final cartoons = content.where((item) => item['type'] == 'cartoon').toList();

            return ListView(
              children: <Widget>[
                _buildContentSection('Stories', stories),
                _buildContentSection('Games', games),
                _buildContentSection('Videos', videos),
                _buildContentSection('Quizzes', quizzes),
                _buildContentSection('Puzzles', puzzles),
                _buildContentSection('Cartoons', cartoons),
              ],
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
    );
  }

  Widget _buildContentSection(String title, List<dynamic> content) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: <Widget>[
        Padding(
          padding: const EdgeInsets.all(8.0),
          child: Text(
            title,
            style: const TextStyle(fontSize: 24, fontWeight: FontWeight.bold),
          ),
        ),
        SizedBox(
          height: 200,
          child: ListView.builder(
            scrollDirection: Axis.horizontal,
            itemCount: content.length,
            itemBuilder: (context, index) {
              final item = content[index];
              return Card(
                child: Column(
                  children: <Widget>[
                    Image.network(item['url'], height: 100),
                    Text(item['title']),
                    ElevatedButton(
                      onPressed: () => _listen(item['id']),
                      child: const Text('Listen'),
                    ),
                  ],
                ),
              );
            },
          ),
        ),
      ],
    );
  }

  void _listen(int id) async {
    try {
      final url = await _ttsService.getAudioUrl(id);
      await _audioPlayer.play(url);
    } catch (e) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text(e.toString())),
      );
    }
  }
}
