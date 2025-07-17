import 'package:flutter/material.dart';
import 'package:stacktots_mobile/services/content_service.dart';

class QuizScreen extends StatefulWidget {
  final int id;

  const QuizScreen({Key? key, required this.id}) : super(key: key);

  @override
  _QuizScreenState createState() => _QuizScreenState();
}

class _QuizScreenState extends State<QuizScreen> {
  final ContentService _contentService = ContentService();
  late Future<Map<String, dynamic>> _quiz;
  int _currentQuestionIndex = 0;
  String? _selectedAnswer;
  int _score = 0;
  bool _quizFinished = false;

  @override
  void initState() {
    super.initState();
    _quiz = _fetchQuiz();
  }

  Future<Map<String, dynamic>> _fetchQuiz() async {
    final content = await _contentService.getContent();
    return content.firstWhere((item) => item['id'] == widget.id);
  }

  void _selectAnswer(String answer) {
    setState(() {
      _selectedAnswer = answer;
    });
  }

  void _nextQuestion() {
    final quizData = _quiz as Map<String, dynamic>;
    if (_selectedAnswer == quizData['data']['questions'][_currentQuestionIndex]['answer']) {
      setState(() {
        _score++;
      });
    }
    setState(() {
      _selectedAnswer = null;
      if (_currentQuestionIndex < quizData['data']['questions'].length - 1) {
        _currentQuestionIndex++;
      } else {
        _quizFinished = true;
      }
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Quiz'),
      ),
      body: FutureBuilder<Map<String, dynamic>>(
        future: _quiz,
        builder: (context, snapshot) {
          if (snapshot.hasData) {
            final quiz = snapshot.data!;
            if (_quizFinished) {
              return Center(
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    Text(
                      'Quiz Finished!',
                      style: Theme.of(context).textTheme.headline4,
                    ),
                    Text(
                      'Your score: $_score / ${quiz['data']['questions'].length}',
                      style: Theme.of(context).textTheme.headline6,
                    ),
                  ],
                ),
              );
            }
            final question = quiz['data']['questions'][_currentQuestionIndex];
            return Column(
              children: [
                Text(
                  question['question'],
                  style: Theme.of(context).textTheme.headline5,
                ),
                ...question['options'].map<Widget>((option) {
                  return RadioListTile<String>(
                    title: Text(option),
                    value: option,
                    groupValue: _selectedAnswer,
                    onChanged: (value) => _selectAnswer(value!),
                  );
                }).toList(),
                ElevatedButton(
                  onPressed: _selectedAnswer == null ? null : _nextQuestion,
                  child: const Text('Next'),
                ),
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
