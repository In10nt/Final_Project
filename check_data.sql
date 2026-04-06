SELECT 
    name,
    category,
    available_sizes,
    LEFT(size_chart, 30) as size_chart_preview
FROM products
LIMIT 3;
