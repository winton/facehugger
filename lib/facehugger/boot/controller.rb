Application.class_eval do

  Dir["#{root}/lib/facehugger/controller/*.rb"].sort.each do |path|
    require path
  end
end