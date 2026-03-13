import 'package:dio/dio.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';

class ApiService {
  static const String baseUrl = 'https://api.virtualtryon.com';
  late Dio _dio;
  final FlutterSecureStorage _storage = const FlutterSecureStorage();

  ApiService() {
    _dio = Dio(BaseOptions(
      baseUrl: baseUrl,
      connectTimeout: const Duration(seconds: 30),
      receiveTimeout: const Duration(seconds: 30),
    ));

    _dio.interceptors.add(InterceptorsWrapper(
      onRequest: (options, handler) async {
        final token = await _storage.read(key: 'auth_token');
        if (token != null) {
          options.headers['Authorization'] = 'Bearer $token';
        }
        handler.next(options);
      },
      onError: (error, handler) {
        if (error.response?.statusCode == 401) {
          _storage.delete(key: 'auth_token');
        }
        handler.next(error);
      },
    ));
  }

  // Auth endpoints
  Future<Map<String, dynamic>> login(String email, String password) async {
    final response = await _dio.post('/api/auth/login', data: {
      'email': email,
      'password': password,
    });
    return response.data;
  }

  Future<void> register(Map<String, dynamic> userData) async {
    await _dio.post('/api/auth/register', data: userData);
  }

  // Product endpoints
  Future<List<Map<String, dynamic>>> getProducts({
    int page = 0,
    int size = 20,
  }) async {
    final response = await _dio.get('/api/products', queryParameters: {
      'page': page,
      'size': size,
    });
    return List<Map<String, dynamic>>.from(response.data['content']);
  }

  Future<Map<String, dynamic>> getProductById(String id) async {
    final response = await _dio.get('/api/products/$id');
    return response.data;
  }

  Future<Map<String, dynamic>> getProductByBarcode(String barcode) async {
    final response = await _dio.get('/api/products/barcode/$barcode');
    return response.data;
  }

  // Body profile endpoints
  Future<Map<String, dynamic>> getBodyProfile() async {
    final response = await _dio.get('/api/body-profiles/me');
    return response.data;
  }

  Future<Map<String, dynamic>> updateBodyProfile(
      Map<String, dynamic> profileData) async {
    final response = await _dio.put('/api/body-profiles/me', data: profileData);
    return response.data;
  }

  // Virtual try-on endpoints
  Future<Map<String, dynamic>> createTryOnSession({
    required String productId,
    required String variantId,
    required String bodyProfileId,
  }) async {
    final response = await _dio.post('/api/try-on/sessions', data: {
      'productId': productId,
      'variantId': variantId,
      'bodyProfileId': bodyProfileId,
    });
    return response.data;
  }

  // Token management
  Future<void> saveToken(String token) async {
    await _storage.write(key: 'auth_token', value: token);
  }

  Future<String?> getToken() async {
    return await _storage.read(key: 'auth_token');
  }

  Future<void> clearToken() async {
    await _storage.delete(key: 'auth_token');
  }
}