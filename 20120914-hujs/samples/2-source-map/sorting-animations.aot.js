var SortingAnimations;
    
SortingAnimations = function (canvas) {

    var ctx = canvas.getContext ? canvas.getContext("2d") : null;
    
    var lineWidth = 9;
    var updateCost = 50;
    var compareCost = 30;
    
    var randomArray = function () {
        var array = [];
        var length = Math.floor(canvas.width / (lineWidth + 1));
        
        for (var i = 1; i <= length; i++) {
            array.push(i);
        }

        array.sort(function() { return (Math.round(Math.random()) - 0.5); });
        return array;
    }
    
    var paint = function (array, updating) {

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.lineWidth = lineWidth;

        for (var i = 0; i < array.length; i++)
        {
            var x = (lineWidth + 1) * i + lineWidth / 2;
            var height = array[i] * (lineWidth + 1) * canvas.height / canvas.width;
            
            ctx.beginPath();
            
            if (updating && updating.indexOf(i) >= 0) {
                ctx.strokeStyle = "red";
            } else {
                ctx.strokeStyle = "black";
            }
            
            ctx.moveTo(x, canvas.height);
            ctx.lineTo(x, canvas.height - height);
        
            ctx.stroke();
        }
    }
    
    var compareAsync = /* async << function (x, y) { */        (function (x, y) {
                                            var _builder_$0 = Wind.builders["async"];
                                            return _builder_$0.Start(this,
                                                _builder_$0.Delay(function () {
/*     $await(Wind.Async.sleep(compareCost)); */    return _builder_$0.Bind(Wind.Async.sleep(compareCost), function () {
/*     return x - y; */                                 return _builder_$0.Return(x - y);
                                                    });
                                                })
                                            );
/* } */                                 });

    var swapAsync = /* async << function (array, i, j) { */   (function (array, i, j) {
                                              var _builder_$0 = Wind.builders["async"];
                                              return _builder_$0.Start(this,
                                                  _builder_$0.Delay(function () {
/*     var t = array[i]; */                           var t = array[i];
/*     array[i] = array[j]; */                        array[i] = array[j];
/*     array[j] = t; */                               array[j] = t;
/*     paint(array, [i, j]); */                       paint(array, [i, j]);
/*     $await(Wind.Async.sleep(updateCost)); */       return _builder_$0.Bind(Wind.Async.sleep(updateCost), function () {
                                                          return _builder_$0.Normal();
                                                      });
                                                  })
                                              );
/* } */                                   });
    
    var assignAsync = /* async << function (array, i, value, updating) { */   (function (array, i, value, updating) {
                                                            var _builder_$0 = Wind.builders["async"];
                                                            return _builder_$0.Start(this,
                                                                _builder_$0.Delay(function () {
/*     array[i] = value; */                                         array[i] = value;
/*     paint(array, updating); */                                   paint(array, updating);
/*     $await(Wind.Async.sleep(updateCost)); */                     return _builder_$0.Bind(Wind.Async.sleep(updateCost), function () {
                                                                        return _builder_$0.Normal();
                                                                    });
                                                                })
                                                            );
/* } */                                                 });
    
    var sortOperations = {
    
        Bubble: /* async << function (array) { */              (function (array) {
                                                   var _builder_$0 = Wind.builders["async"];
                                                   return _builder_$0.Start(this,
                                                       _builder_$0.Delay(function () {
/*     var i = 0; */                                       var i = 0;
/*     for ( */                                            return _builder_$0.For(function () {
/*     ; i < array.length */                                   return i < array.length;
                                                           }, function () {
/*     ; i ++) { */                                            i ++;
                                                           },
                                                               _builder_$0.Delay(function () {
/*         var j = 0; */                                           var j = 0;
/*         for ( */                                                return _builder_$0.For(function () {
/*         ; j < array.length - i - 1 */                               return j < array.length - i - 1;
                                                                   }, function () {
/*         ; j ++) { */                                                j ++;
                                                                   },
                                                                       _builder_$0.Delay(function () {
/*             var r = $await(compareAsync(array[j], array[j + 1])); */    return _builder_$0.Bind(compareAsync(array[j], array[j + 1]), function (r) {
/*             if (r > 0) { */                                                 if (r > 0) {
/*                 $await(swapAsync(array, j, j + 1)); */                          return _builder_$0.Bind(swapAsync(array, j, j + 1), function () {
                                                                                       return _builder_$0.Normal();
                                                                                   });
/*             } */                                                            } else {
                                                                                   return _builder_$0.Normal();
                                                                               }
                                                                           });
                                                                       })
/*         } */                                                    );
                                                               })
/*     } */                                                );
                                                       })
                                                   );
/* } */                                        }),
        
        Quick: /* async << function (array) { */                      (function (array) {
                                                           var _builder_$0 = Wind.builders["async"];
                                                           return _builder_$0.Start(this,
                                                               _builder_$0.Delay(function () {
/*     var partitionAsync = async << function (begin, end) { */    var partitionAsync = (function (begin, end) {
                                                                       var _builder_$1 = Wind.builders["async"];
                                                                       return _builder_$1.Start(this,
                                                                           _builder_$1.Delay(function () {
/*         var i = begin; */                                                   var i = begin;
/*         var j = end; */                                                     var j = end;
/*         var pivot = array[Math.floor((begin + end) / 2)]; */                var pivot = array[Math.floor((begin + end) / 2)];
                                                                               return _builder_$1.Combine(
                                                                                   _builder_$1.While(function () {
/*         while (i <= j) { */                                                         return i <= j;
                                                                                   },
                                                                                       _builder_$1.Combine(
                                                                                           _builder_$1.While(function () {
/*             while (true) { */                                                               return true;
                                                                                           },
                                                                                               _builder_$1.Delay(function () {
/*                 var r = $await(compareAsync(array[i], pivot)); */                               return _builder_$1.Bind(compareAsync(array[i], pivot), function (r) {
/*                 if (r < 0) { */                                                                     if (r < 0) {
/*                     i ++; */                                                                            i ++;
/*                 } else { */                                                                         } else {
/*                     break; */                                                                           return _builder_$1.Break();
/*                 } */                                                                                }
                                                                                                       return _builder_$1.Normal();
                                                                                                   });
                                                                                               })
/*             } */                                                                        ),
                                                                                           _builder_$1.Combine(
                                                                                               _builder_$1.While(function () {
/*             while (true) { */                                                                   return true;
                                                                                               },
                                                                                                   _builder_$1.Delay(function () {
/*                 var r = $await(compareAsync(array[j], pivot)); */                                   return _builder_$1.Bind(compareAsync(array[j], pivot), function (r) {
/*                 if (r > 0) { */                                                                         if (r > 0) {
/*                     j --; */                                                                                j --;
/*                 } else { */                                                                             } else {
/*                     break; */                                                                               return _builder_$1.Break();
/*                 } */                                                                                    }
                                                                                                           return _builder_$1.Normal();
                                                                                                       });
                                                                                                   })
/*             } */                                                                            ),
                                                                                               _builder_$1.Delay(function () {
/*             if (i <= j) { */                                                                    if (i <= j) {
/*                 $await(swapAsync(array, i, j)); */                                                  return _builder_$1.Bind(swapAsync(array, i, j), function () {
/*                 i ++; */                                                                                i ++;
/*                 j --; */                                                                                j --;
                                                                                                           return _builder_$1.Normal();
                                                                                                       });
/*             } */                                                                                } else {
                                                                                                       return _builder_$1.Normal();
                                                                                                   }
                                                                                               })
                                                                                           )
                                                                                       )
/*         } */                                                                    ),
                                                                                   _builder_$1.Delay(function () {
/*         return i; */                                                                return _builder_$1.Return(i);
                                                                                   })
                                                                               );
                                                                           })
                                                                       );
/*     }; */                                                       });
/*     var sortAsync = async << function (begin, end) { */         var sortAsync = (function (begin, end) {
                                                                       var _builder_$2 = Wind.builders["async"];
                                                                       return _builder_$2.Start(this,
                                                                           _builder_$2.Delay(function () {
/*         var index = $await(partitionAsync(begin, end)); */                  return _builder_$2.Bind(partitionAsync(begin, end), function (index) {
                                                                                   return _builder_$2.Combine(
                                                                                       _builder_$2.Delay(function () {
/*         if (begin < index - 1) { */                                                     if (begin < index - 1) {
/*             $await(sortAsync(begin, index - 1)); */                                         return _builder_$2.Bind(sortAsync(begin, index - 1), function () {
                                                                                                   return _builder_$2.Normal();
                                                                                               });
/*         } */                                                                            } else {
                                                                                               return _builder_$2.Normal();
                                                                                           }
                                                                                       }),
                                                                                       _builder_$2.Delay(function () {
/*         if (index < end) { */                                                           if (index < end) {
/*             $await(sortAsync(index, end)); */                                               return _builder_$2.Bind(sortAsync(index, end), function () {
                                                                                                   return _builder_$2.Normal();
                                                                                               });
/*         } */                                                                            } else {
                                                                                               return _builder_$2.Normal();
                                                                                           }
                                                                                       })
                                                                                   );
                                                                               });
                                                                           })
                                                                       );
/*     }; */                                                       });
/*     $await(sortAsync(0, array.length - 1)); */                  return _builder_$0.Bind(sortAsync(0, array.length - 1), function () {
                                                                       return _builder_$0.Normal();
                                                                   });
                                                               })
                                                           );
/* } */                                                }),
        
        Selection: /* async << function (array) { */   (function (array) {
                                        var _builder_$0 = Wind.builders["async"];
                                        return _builder_$0.Start(this,
                                            _builder_$0.Delay(function () {
/*     var j = 0; */                            var j = 0;
/*     for ( */                                 return _builder_$0.For(function () {
/*     ; j < array.length - 1 */                    return j < array.length - 1;
                                                }, function () {
/*     ; j ++) { */                                 j ++;
                                                },
                                                    _builder_$0.Delay(function () {
/*         var mi = j; */                               var mi = j;
                                                        return _builder_$0.Combine(
                                                            _builder_$0.Delay(function () {
/*         var i = j + 1; */                                    var i = j + 1;
/*         for ( */                                             return _builder_$0.For(function () {
/*         ; i < array.length */                                    return i < array.length;
                                                                }, function () {
/*         ; i ++) { */                                             i ++;
                                                                },
                                                                    _builder_$0.Delay(function () {
/*             var r = $await(compareAsync(array[i], array[mi])); */    return _builder_$0.Bind(compareAsync(array[i], array[mi]), function (r) {
/*             if (r < 0) { */                                              if (r < 0) {
/*                 mi = i; */                                                   mi = i;
/*             } */                                                         }
                                                                            return _builder_$0.Normal();
                                                                        });
                                                                    })
/*         } */                                                 );
                                                            }),
                                                            _builder_$0.Delay(function () {
/*         $await(swapAsync(array, mi, j)); */                  return _builder_$0.Bind(swapAsync(array, mi, j), function () {
                                                                    return _builder_$0.Normal();
                                                                });
                                                            })
                                                        );
                                                    })
/*     } */                                     );
                                            })
                                        );
/* } */                             }),
        
        Shell: /* async << function (array) { */              (function (array) {
                                                   var _builder_$0 = Wind.builders["async"];
                                                   return _builder_$0.Start(this,
                                                       _builder_$0.Delay(function () {
/*     var gaps = [701, 301, 132, 57, 23, 10, 4, 1]; */    var gaps = [701, 301, 132, 57, 23, 10, 4, 1];
/*     var gap = Math.floor(array.length / 2); */          var gap = Math.floor(array.length / 2);
/*     for ( */                                            return _builder_$0.For(function () {
/*     ; gap > 0 */                                            return gap > 0;
                                                           }, function () {
/*     ; gap = Math.floor(gap / 2)) { */                       gap = Math.floor(gap / 2);
                                                           },
                                                               _builder_$0.Delay(function () {
/*         var i = gap; */                                         var i = gap;
/*         for ( */                                                return _builder_$0.For(function () {
/*         ; i < array.length */                                       return i < array.length;
                                                                   }, function () {
/*         ; i ++) { */                                                i ++;
                                                                   },
                                                                       _builder_$0.Delay(function () {
/*             var temp = array[i]; */                                     var temp = array[i];
/*             var j; */                                                   var j;
                                                                           return _builder_$0.Combine(
                                                                               _builder_$0.Delay(function () {
/*             j = i */                                                            j = i
/*             for ( */                                                            return _builder_$0.For(function () {
/*             ; j >= gap */                                                           return j >= gap;
                                                                                   }, function () {
/*             ; j -= gap) { */                                                        j -= gap;
                                                                                   },
                                                                                       _builder_$0.Delay(function () {
/*                 var r = $await(compareAsync(temp, array[j - gap])); */                  return _builder_$0.Bind(compareAsync(temp, array[j - gap]), function (r) {
/*                 if (r < 0) { */                                                             if (r < 0) {
/*                     $await(assignAsync(array, j, array[j - gap])); */                           return _builder_$0.Bind(assignAsync(array, j, array[j - gap]), function () {
                                                                                                       return _builder_$0.Normal();
                                                                                                   });
/*                 } else { */                                                                 } else {
/*                     break; */                                                                   return _builder_$0.Break();
/*                 } */                                                                        }
                                                                                           });
                                                                                       })
/*             } */                                                                );
                                                                               }),
                                                                               _builder_$0.Delay(function () {
/*             $await(assignAsync(array, j, temp, [j])); */                        return _builder_$0.Bind(assignAsync(array, j, temp, [j]), function () {
                                                                                       return _builder_$0.Normal();
                                                                                   });
                                                                               })
                                                                           );
                                                                       })
/*         } */                                                    );
                                                               })
/*     } */                                                );
                                                       })
                                                   );
/* } */                                        })
    };

    this.supported = !!ctx;
    this.randomArray = randomArray;
    this.paint = paint;
    
    this.names = [];
    for (var m in sortOperations) this.names.push(m);
    
    this.sortAsync = /* async << function (name, array) { */   (function (name, array) {
                                              var _builder_$0 = Wind.builders["async"];
                                              return _builder_$0.Start(this,
                                                  _builder_$0.Delay(function () {
/*     paint(array); */                               paint(array);
/*     $await(sortOperations[name](array)); */        return _builder_$0.Bind(sortOperations[name](array), function () {
/*     paint(array); */                                   paint(array);
                                                          return _builder_$0.Normal();
                                                      });
                                                  })
                                              );
/* } */                                   });
};