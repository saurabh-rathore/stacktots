import 'package:flutter/material.dart';
import 'package:stacktots_mobile/services/rewards_service.dart';

class RewardsScreen extends StatefulWidget {
  const RewardsScreen({Key? key}) : super(key: key);

  @override
  _RewardsScreenState createState() => _RewardsScreenState();
}

class _RewardsScreenState extends State<RewardsScreen> {
  final RewardsService _rewardsService = RewardsService();
  late Future<List<dynamic>> _rewards;
  late Future<int> _points;

  @override
  void initState() {
    super.initState();
    _rewards = _rewardsService.getRewards();
    _points = _rewardsService.getPoints();
  }

  void _redeemReward(int id) async {
    try {
      await _rewardsService.redeemReward(id);
      setState(() {
        _points = _rewardsService.getPoints();
      });
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
        title: const Text('Rewards'),
      ),
      body: Column(
        children: <Widget>[
          FutureBuilder<int>(
            future: _points,
            builder: (context, snapshot) {
              if (snapshot.hasData) {
                return Padding(
                  padding: const EdgeInsets.all(8.0),
                  child: Text(
                    'Your Points: ${snapshot.data}',
                    style: const TextStyle(fontSize: 24, fontWeight: FontWeight.bold),
                  ),
                );
              } else if (snapshot.hasError) {
                return Text('${snapshot.error}');
              }
              return const CircularProgressIndicator();
            },
          ),
          Expanded(
            child: FutureBuilder<List<dynamic>>(
              future: _rewards,
              builder: (context, snapshot) {
                if (snapshot.hasData) {
                  final rewards = snapshot.data!;
                  return ListView.builder(
                    itemCount: rewards.length,
                    itemBuilder: (context, index) {
                      final reward = rewards[index];
                      return Card(
                        child: ListTile(
                          title: Text(reward['name']),
                          subtitle: Text('Cost: ${reward['points_cost']} points'),
                          trailing: ElevatedButton(
                            onPressed: () => _redeemReward(reward['id']),
                            child: const Text('Redeem'),
                          ),
                        ),
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
        ],
      ),
    );
  }
}
