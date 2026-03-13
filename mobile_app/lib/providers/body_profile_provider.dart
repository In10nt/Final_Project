import 'package:flutter/foundation.dart';
import '../services/api_service.dart';

class BodyProfileProvider with ChangeNotifier {
  final ApiService _apiService;
  
  Map<String, dynamic>? _bodyProfile;
  bool _isLoading = false;
  String? _error;

  BodyProfileProvider(this._apiService);

  Map<String, dynamic>? get bodyProfile => _bodyProfile;
  bool get isLoading => _isLoading;
  String? get error => _error;

  Future<void> loadBodyProfile() async {
    _isLoading = true;
    _error = null;
    notifyListeners();

    try {
      _bodyProfile = await _apiService.getBodyProfile();
    } catch (e) {
      _error = e.toString();
    }

    _isLoading = false;
    notifyListeners();
  }

  Future<bool> updateBodyProfile(Map<String, dynamic> profileData) async {
    _isLoading = true;
    _error = null;
    notifyListeners();

    try {
      _bodyProfile = await _apiService.updateBodyProfile(profileData);
      _isLoading = false;
      notifyListeners();
      return true;
    } catch (e) {
      _error = e.toString();
      _isLoading = false;
      notifyListeners();
      return false;
    }
  }
}