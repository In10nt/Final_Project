import 'package:flutter/foundation.dart';
import '../services/api_service.dart';

class ProductProvider with ChangeNotifier {
  final ApiService _apiService;
  
  List<Map<String, dynamic>> _products = [];
  bool _isLoading = false;
  String? _error;

  ProductProvider(this._apiService);

  List<Map<String, dynamic>> get products => _products;
  bool get isLoading => _isLoading;
  String? get error => _error;

  Future<void> loadProducts() async {
    _isLoading = true;
    _error = null;
    notifyListeners();

    try {
      _products = await _apiService.getProducts();
    } catch (e) {
      _error = e.toString();
    }

    _isLoading = false;
    notifyListeners();
  }

  Future<Map<String, dynamic>?> getProductById(String id) async {
    try {
      return await _apiService.getProductById(id);
    } catch (e) {
      _error = e.toString();
      notifyListeners();
      return null;
    }
  }

  Future<Map<String, dynamic>?> getProductByBarcode(String barcode) async {
    try {
      return await _apiService.getProductByBarcode(barcode);
    } catch (e) {
      _error = e.toString();
      notifyListeners();
      return null;
    }
  }
}