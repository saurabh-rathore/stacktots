import 'package:flutter/material.dart';
import 'package:stacktots_mobile/services/content_service.dart';

class PuzzleScreen extends StatefulWidget {
  final int id;

  const PuzzleScreen({Key? key, required this.id}) : super(key: key);

  @override
  _PuzzleScreenState createState() => _PuzzleScreenState();
}

class _PuzzleScreenState extends State<PuzzleScreen> {
  final ContentService _contentService = ContentService();
  late Future<Map<String, dynamic>> _puzzle;

  @override
  void initState() {
    super.initState();
    _puzzle = _fetchPuzzle();
  }

  Future<Map<String, dynamic>> _fetchPuzzle() async {
    final content = await _contentService.getContent();
    return content.firstWhere((item) => item['id'] == widget.id);
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Puzzle'),
      ),
      body: FutureBuilder<Map<String, dynamic>>(
        future: _puzzle,
        builder: (context, snapshot) {
          if (snapshot.hasData) {
            final puzzle = snapshot.data!;
            return Column(
              children: [
                Text(
                  puzzle['title'],
                  style: Theme.of(context).textTheme.headline5,
                ),
                Text(puzzle['description']),
                if (puzzle['data']['image'] != null)
                  Image.network(puzzle['data']['image']),
                if (puzzle['data']['words'] != null)
                  const Text('Word Search Puzzle coming soon!'),
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
}
